# SnapSec UI Coding Guidelines

This document outlines the coding standards and best practices for the SnapSec UI codebase. Following these guidelines will ensure consistency, improve maintainability, and reduce bugs.

## 1. Directory Structure & Navigation

Understanding the project layout is crucial for efficient development. The project follows a modular structure organized by function and product area.

### 1.1 Current Directory Breakdown

- **`src/auth/`**: All authentication-related logic. Includes pages (Login, Signup, 2FA), context providers, and adapters for external auth services.
- **`src/components/`**:
  - **`ui/`**: Primitive, low-level UI components (e.g., `Button`, `Input`, `Select`). These are mostly based on shadcn/ui and should be kept generic.
  - **`custom/`**: Complex, reusable components that contain more logic (e.g., `Table.jsx`, `EditableTable.jsx`, `PageHeading.jsx`).
- **`src/pages/`**: The main application views, organized by product module:
  - **`VM/`**: Vulnerability Management.
  - **`ASM/`**: Attack Surface Management.
  - **`AIM/`**: Asset Identity Management.
  - **`TM/`**: Threat Modeler.
  - **`VS/`**: Vulnerability Scanner.
  - *Note*: Each page directory usually contains a `components/` folder for page-specific elements and a `store.js` for Zustand state.
- **`src/services/`**: Centralized API definitions using RTK Query.
  - **`baseApi.js`**: The main API configuration (base URL, headers, error handling).
  - **`[module]/`**: Specific endpoints for each product module (e.g., `services/vm/assessmentsApi.js`).
- **`src/routing/`**: Route definitions and navigation logic.
  - **`app-routing-setup.jsx`**: The main mapping of paths to components.
- **`src/hooks/`**: Global reusable React hooks (e.g., `useDebounce`, `usePagination`).
- **`src/lib/`**: Utility functions (`utils.js`) and third-party library initializations.
- **`src/layouts/`**: High-level layout components like the Sidebar, Navbar, and Main Layout wrappers.

### 1.2 How to Navigate
1. **Adding a New Page**: Create a folder in `src/pages/[Module]/pages/[NewPage]`. Add it to `src/routing/app-routing-setup.jsx`.
2. **Adding an API Endpoint**: Find the relevant service in `src/services/[Module]/` and use `injectEndpoints`.
3. **Creating a Reusable UI Element**: Add it to `src/components/ui/` if it's a primitive, or `src/components/custom/` if it's complex.

### 1.3 Target Structure (Future Refactor)
While the current structure is functional, we are moving towards a more strict **Feature-Based** structure:
```
src/
  features/
    vm/
      components/
      hooks/
      services/
      pages/
      store.js
```
---

### 1.2 Naming Conventions
- **Components**: PascalCase (e.g., `AssessmentTable.jsx`).
- **Hooks**: camelCase with `use` prefix (e.g., `usePagination.js`).
- **Utilities/Services**: camelCase (e.g., `formatDate.js`).
- **Files**: Match the export name.

---

## 2. State Management

### 2.1 Choosing the Right Tool
- **Local Component State**: Use `useState` for state that doesn't leave the component.
- **Page/Feature State**: Use **Zustand**. It is preferred for managing complex page states like filters, pagination, and UI toggles.
- **Global Auth/User State**: Use **React Context** (already implemented in `auth-context`).
- **Server Cache**: Use **RTK Query**. Do not duplicate server data in Zustand or Redux slices.

### 2.2 Zustand Best Practices
- Define stores close to where they are used (e.g., `src/pages/VM/pages/assessment/store.js`).
- Use selectors to prevent unnecessary re-renders.

**Example Store:**
```javascript
import { create } from 'zustand';

export const useAssessmentStore = create((set) => ({
  searchQuery: '',
  pagination: { pageIndex: 0, pageSize: 12 },
  filters: {},
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPagination: (updater) => set((state) => ({
    pagination: typeof updater === 'function' ? updater(state.pagination) : updater,
  })),
  resetFilters: () => set({ filters: {}, searchQuery: '' }),
}));

// Usage in Component
const searchQuery = useAssessmentStore((state) => state.searchQuery);
const setSearchQuery = useAssessmentStore((state) => state.setSearchQuery);
```

---

## 3. Data Fetching & API Interaction

### 3.1 RTK Query over React Query
The codebase currently has both. **RTK Query is the standard for this project.**
- Define endpoints in `src/services/` using `injectEndpoints` to keep `baseApi.js` clean.

**Example API Injection:**
```javascript
// src/services/vm/assessmentsApi.js
import { baseApi } from '../baseApi';

export const assessmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVmAssessments: builder.query({
      query: (params) => ({
        url: '/vm/assessments',
        method: 'GET',
        params,
      }),
      providesTags: ['VmAssessments'],
    }),
  }),
});

export const { useGetVmAssessmentsQuery } = assessmentsApi;
```

### 3.2 Error Handling
- Handle API errors gracefully using the `error` object returned by RTK Query hooks.
- Use the `sonner` library for toast notifications on mutations.

---

## 4. Component Patterns

### 4.1 Component Composition
Break down large components (like `Table.jsx`) into smaller, focused sub-components.
- **Container Components**: Handle logic and data fetching.
- **Presentational Components**: Handle UI only.

### 4.2 Prop Types & Defaults
- Always provide default values for optional props.

**Example Component:**
```javascript
const StatusBadge = ({ status = 'pending', className }) => {
  const variants = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', variants[status], className)}>
      {status.toUpperCase()}
    </span>
  );
};
```

---

## 5. Form Handling & Validation

### 5.1 Standardize on React Hook Form + Zod
- **Library**: Use `react-hook-form`.
- **Validation**: Use `zod` for schema definition.

**Example Form:**
```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
};
```

---

## 6. Styling & UI

### 6.1 Tailwind CSS
- Use Tailwind for all styling.
- Use the `cn()` utility for conditional classes.

**Example `cn()` usage:**
```javascript
import { cn } from '@/lib/utils';

const Button = ({ variant, className, ...props }) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md transition-colors',
        variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black',
        className // Allows overriding or adding styles
      )}
      {...props}
    />
  );
};
```

---

## 7. Performance & Optimization

### 7.1 Memoization & Debouncing
- Use `useMemo` for expensive calculations.
- Use `useDebounce` for search inputs to reduce API calls.

**Example Debounce:**
```javascript
import useDebounce from '@/hooks/use-debounce';

const AssessmentList = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  // API call only triggers when debouncedQuery changes
  const { data } = useGetVmAssessmentsQuery({ search: debouncedQuery });

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
};
```

---

## 8. Testing & Quality Assurance

### 8.1 E2E Testing
- Use **Playwright** for critical user flows.
- Tests are located in the `tests/` directory.

---

## 9. Migration & Cleanup (Technical Debt)

To reduce confusion, we should prioritize removing redundant libraries:
1.  **Remove Formik**: Migrate all forms to `react-hook-form`.
2.  **Remove React Query**: Migrate all remaining `react-query` calls to RTK Query.
3.  **Remove Yup**: Use `zod` for all validations.
4.  **Standardize Routing**: Ensure all navigation uses `react-router-dom` hooks (`useNavigate`, `useParams`).
