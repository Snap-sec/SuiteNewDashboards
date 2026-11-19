# Button Component Audit Report

This report documents all occurrences of the `<Button />` component across the project that violate UX and design system standards:

1. **Missing Icon**: The button is rendered without a contextual icon (e.g., missing Lucide icon for actions like Save, Delete, Add, Filter, Continue, etc.).
2. **Ghost Variant on Action**: The button represents an Action (e.g. "Launch Scan", "Add Project", "Save Query", "Add Condition", etc.) but uses `variant="ghost"` instead of `variant="primary"`.

## Executive Summary

| Metric | Count |
| :--- | :--- |
| **Total Button Issues Found** | **596** |
| **Issue 1: Missing Icon** | **570** |
| **Issue 2: Action Button with Ghost Variant** | **30** |
| **Both Issue 1 & Issue 2** | **4** |

## Issues Grouped by Module

- [Source: auth (10 issues)](#source-auth)
- [Source: components (19 issues)](#source-components)
- [Pages: AIM (56 issues)](#pages-aim)
- [Pages: ASM (58 issues)](#pages-asm)
- [Pages: Agent (4 issues)](#pages-agent)
- [Pages: CSM (17 issues)](#pages-csm)
- [Pages: Home (2 issues)](#pages-home)
- [Pages: SAST (5 issues)](#pages-sast)
- [Pages: SCA (14 issues)](#pages-sca)
- [Pages: VM (153 issues)](#pages-vm)
- [Pages: VS (34 issues)](#pages-vs)
- [Pages: WAS (36 issues)](#pages-was)
- [Pages: account (52 issues)](#pages-account)
- [Pages: auto-pt (41 issues)](#pages-auto-pt)
- [Pages: automation (29 issues)](#pages-automation)
- [Pages: dashboards (4 issues)](#pages-dashboards)
- [Pages: integrations (2 issues)](#pages-integrations)
- [Pages: notifications (1 issues)](#pages-notifications)
- [Pages: public (21 issues)](#pages-public)
- [Pages: public-profile (2 issues)](#pages-public-profile)
- [Pages: service-account (6 issues)](#pages-service-account)
- [Source: partials (30 issues)](#source-partials)

---

## Detailed Findings

### Source: auth

#### 1. [`src/auth/pages/extended/join-tfa.jsx:219`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/join-tfa.jsx#L219)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/join-tfa.jsx`
- **Line Number**: `219`
- **Button Label**: `/ Resend`
- **Current Variant**: `link`
- **Issue**: **Missing Icon**: The button with label "/ Resend" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>/ Resend</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   218 |         </span>
>  219 |         <Button
   220 |           variant="link"
   221 |           className="p-0 h-auto font-semibold text-foreground hover:text-primary disabled:text-secondary-foreground disabled:opacity-70"
   222 |           onClick={handleResendCode}
```

</details>

---

#### 2. [`src/auth/pages/extended/join-tfa.jsx:229`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/join-tfa.jsx#L229)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/join-tfa.jsx`
- **Line Number**: `229`
- **Button Label**: `Continue`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Continue" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Continue</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   228 | 
>  229 |       <Button className="grow" onClick={handleVerifyOtp}>Continue</Button>
   230 | 
   231 |       <Link
   232 |         to="/auth/signin"
```

</details>

---

#### 3. [`src/auth/pages/extended/login-tfa.jsx:199`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/login-tfa.jsx#L199)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/login-tfa.jsx`
- **Line Number**: `199`
- **Button Label**: `/ Resend`
- **Current Variant**: `link`
- **Issue**: **Missing Icon**: The button with label "/ Resend" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>/ Resend</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   198 |         </span>
>  199 |         <Button
   200 |           variant="link"
   201 |           className="p-0 h-auto font-semibold text-foreground hover:text-primary disabled:text-secondary-foreground disabled:opacity-70"
   202 |           onClick={handleResendCode}
```

</details>

---

#### 4. [`src/auth/pages/extended/login-tfa.jsx:211`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/login-tfa.jsx#L211)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/login-tfa.jsx`
- **Line Number**: `211`
- **Button Label**: `Continue`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Continue" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Continue</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   210 | 
>  211 |       <Button
   212 |         disabled={codeInputs.some((val) => val === '')} // Disable if any input is empty
   213 |         className="grow"
   214 |         onClick={handleVerifyOtp}
```

</details>

---

#### 5. [`src/auth/pages/extended/register-tfa-fixed.jsx:139`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/register-tfa-fixed.jsx#L139)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/register-tfa-fixed.jsx`
- **Line Number**: `139`
- **Button Label**: `/ Resend`
- **Current Variant**: `link`
- **Issue**: **Missing Icon**: The button with label "/ Resend" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>/ Resend</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   138 |         </span>
>  139 |         <Button
   140 |           variant="link"
   141 |           className="p-0 h-auto font-semibold text-foreground hover:text-primary disabled:text-secondary-foreground disabled:opacity-70"
   142 |           onClick={handleResendCode}
```

</details>

---

#### 6. [`src/auth/pages/extended/register-tfa-fixed.jsx:149`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/register-tfa-fixed.jsx#L149)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/register-tfa-fixed.jsx`
- **Line Number**: `149`
- **Button Label**: `Continue`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Continue" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Continue</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   148 | 
>  149 |       <Button className="grow" onClick={handleVerifyOtp}>Continue</Button>
   150 | 
   151 |       <Link
   152 |         to="/auth/signin"
```

</details>

---

#### 7. [`src/auth/pages/extended/register-tfa.jsx:240`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/register-tfa.jsx#L240)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/register-tfa.jsx`
- **Line Number**: `240`
- **Button Label**: `/ Resend`
- **Current Variant**: `link`
- **Issue**: **Missing Icon**: The button with label "/ Resend" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>/ Resend</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   239 |         </span>
>  240 |         <Button
   241 |           variant="link"
   242 |           className="p-0 h-auto font-semibold text-foreground hover:text-primary disabled:text-secondary-foreground disabled:opacity-70"
   243 |           onClick={handleResendCode}
```

</details>

---

#### 8. [`src/auth/pages/extended/register-tfa.jsx:250`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/register-tfa.jsx#L250)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/register-tfa.jsx`
- **Line Number**: `250`
- **Button Label**: `Verifying... / Continue`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Verifying... / Continue" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Verifying... / Continue</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   249 | 
>  250 |       <Button className="grow" onClick={handleVerifyOtp} disabled={isVerifyingOtp || codeInputs.includes('')}>
   251 |         {isVerifyingOtp ? 'Verifying...' : 'Continue'}
   252 |       </Button>
   253 | 
```

</details>

---

#### 9. [`src/auth/pages/extended/tfa.jsx:71`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/tfa.jsx#L71)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/extended/tfa.jsx`
- **Line Number**: `71`
- **Button Label**: `Continue`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Continue" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Continue</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    70 | 
>   71 |       <Button className="grow">Continue</Button>
    72 | 
    73 |       <Link
    74 |         to="/auth/signin"
```

</details>

---

#### 10. [`src/auth/pages/onboarding.jsx:129`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/onboarding.jsx#L129)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/auth/pages/onboarding.jsx`
- **Line Number**: `129`
- **Button Label**: `Complete`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Complete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Complete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   128 |             </Button>
>  129 |             <Button
   130 |               type="submit"
   131 |               variant="outline"
   132 |               disabled={isLoading || form.formState.isSubmitting}
```

</details>

---

### Source: components

#### 11. [`src/components/common/create-automation-rule-modal.jsx:309`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/common/create-automation-rule-modal.jsx#L309)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/common/create-automation-rule-modal.jsx`
- **Line Number**: `309`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   308 |       <div className="flex justify-end mt-6 gap-2">
>  309 |         <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
   310 |         <Button
   311 |           variant="outline"
   312 |           onClick={handleSaveRule}
```

</details>

---

#### 12. [`src/components/common/error-screen.jsx:36`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/common/error-screen.jsx#L36)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/common/error-screen.jsx`
- **Line Number**: `36`
- **Button Label**: `Retry`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Retry" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Retry</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    35 | 
>   36 |       <Button onClick={() => window.location.reload()}>Retry</Button>
    37 |     </div>
    38 |   );
    39 | }
```

</details>

---

#### 13. [`src/components/common/recaptcha-popover.jsx:90`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/common/recaptcha-popover.jsx#L90)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/common/recaptcha-popover.jsx`
- **Line Number**: `90`
- **Button Label**: `{verifyButtonText}`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "{verifyButtonText}" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>{verifyButtonText}</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    89 |             <div ref={containerRef} className="min-h-[78px]" />
>   90 |             <Button
    91 |               type="button"
    92 |               variant="mono"
    93 |               onClick={handleVerify}
```

</details>

---

#### 14. [`src/components/common/table-toolbar-filters.jsx:176`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/common/table-toolbar-filters.jsx#L176)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/common/table-toolbar-filters.jsx`
- **Line Number**: `176`
- **Button Label**: `Reset`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Reset" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Reset</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   175 |                 <div className="flex gap-4 w-full">
>  176 |                   <Button
   177 |                     variant="outline"
   178 |                     className="flex-1 rounded-lg font-bold text-foreground hover:text-foreground transition-colors"
   179 |                     onClick={() =>
```

</details>

---

#### 15. [`src/components/custom/button-with-confirmation.jsx:94`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/button-with-confirmation.jsx#L94)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/button-with-confirmation.jsx`
- **Line Number**: `94`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    93 |                         <div onClick={() => setOpen(false)}>
>   94 |                             {cancelButton || <Button variant="outline">Cancel</Button>}
    95 |                         </div>
    96 |                     </DialogClose>
    97 |                     <div onClick={() => onConfirm()}>
```

</details>

---

#### 16. [`src/components/custom/button-with-confirmation.jsx:181`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/button-with-confirmation.jsx#L181)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/button-with-confirmation.jsx`
- **Line Number**: `181`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   180 |                         <div onClick={() => setOpen(false)}>
>  181 |                             {cancelButton || <Button variant="outline">Cancel</Button>}
   182 |                         </div>
   183 |                     </DialogClose>
   184 |                     <div onClick={() => handleConfirm()}>
```

</details>

---

#### 17. [`src/components/custom/button-with-confirmation.jsx:186`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/button-with-confirmation.jsx#L186)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/button-with-confirmation.jsx`
- **Line Number**: `186`
- **Button Label**: `Confirm`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Confirm" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Confirm</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   185 |                         {confirmButton || (
>  186 |                             <Button disabled={userInput !== confirmInput} variant={config.buttonVariant}>
   187 |                                 Confirm
   188 |                             </Button>
   189 |                         )}
```

</details>

---

#### 18. [`src/components/custom/compact-file-upload.jsx:59`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/compact-file-upload.jsx#L59)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/compact-file-upload.jsx`
- **Line Number**: `59`
- **Button Label**: `Browse Files`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Browse Files" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Browse Files</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    58 | 
>   59 |       <Button
    60 |         size=""
    61 |         variant="outline"
    62 |         className="mt-3 px-6"
```

</details>

---

#### 19. [`src/components/custom/date-range-picker.jsx:83`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/date-range-picker.jsx#L83)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/date-range-picker.jsx`
- **Line Number**: `83`
- **Button Label**: `Reset`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Reset" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RotateCcw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RotateCcw className="size-4" />
  <span>Reset</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    82 |         <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
>   83 |           <Button variant="outline" onClick={handleReset}>
    84 |             Reset
    85 |           </Button>
    86 |           <Button onClick={handleApply}>Apply</Button>
```

</details>

---

#### 20. [`src/components/custom/date-range-picker.jsx:86`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/date-range-picker.jsx#L86)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/date-range-picker.jsx`
- **Line Number**: `86`
- **Button Label**: `Apply`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Apply" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Apply</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    85 |           </Button>
>   86 |           <Button onClick={handleApply}>Apply</Button>
    87 |         </div>
    88 |       </PopoverContent>
    89 |     </Popover>
```

</details>

---

#### 21. [`src/components/custom/demo/demo-model.jsx:121`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/demo/demo-model.jsx#L121)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/demo/demo-model.jsx`
- **Line Number**: `121`
- **Button Label**: `Maybe later`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Maybe later" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Maybe later</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   120 |                     </Button>
>  121 |                     <Button
   122 |                         variant="outline"
   123 |                         onClick={handleClose}
   124 |                     >
```

</details>

---

#### 22. [`src/components/custom/file-upload.jsx:230`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/file-upload.jsx#L230)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/file-upload.jsx`
- **Line Number**: `230`
- **Button Label**: `Browse`
- **Current Variant**: `secondary`
- **Issue**: **Missing Icon**: The button with label "Browse" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Browse</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   229 |               </div>
>  230 |               <Button size="sm" variant="secondary">
   231 |                 Browse
   232 |               </Button>
   233 |             </div>
```

</details>

---

#### 23. [`src/components/custom/full-request.jsx:30`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/full-request.jsx#L30)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/full-request.jsx`
- **Line Number**: `30`
- **Button Label**: `Re-Generate Threats / Generate Threats`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Re-Generate Threats / Generate Threats" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Re-Generate Threats / Generate Threats</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    29 |                 <div className="top-0 right-5 absolute -mt-18 mr-4">
>   30 |                     <Button variant="outline" onClick={onClick}>
    31 |                         {generated ? "Re-Generate Threats" : "Generate Threats"}
    32 |                     </Button>
    33 |                 </div>
```

</details>

---

#### 24. [`src/components/custom/preview-base64Img-modal.jsx:28`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/preview-base64Img-modal.jsx#L28)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/preview-base64Img-modal.jsx`
- **Line Number**: `28`
- **Button Label**: `Close`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Close" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Close</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    27 |         <div className="mt-2 flex justify-end">
>   28 |           <Button onClick={() => setIsModalOpen(false)}>Close</Button>
    29 |         </div>
    30 |       }
    31 |       className="w-full md:w-1/2 lg:w-1/3"
```

</details>

---

#### 25. [`src/components/custom/select-with-avatar.jsx:104`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/select-with-avatar.jsx#L104)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/select-with-avatar.jsx`
- **Line Number**: `104`
- **Button Label**: `▼`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "▼" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>▼</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   103 |       <PopoverTrigger className="w-full">
>  104 |         <Button
   105 |           variant="outline"
   106 |           role="combobox"
   107 |           aria-expanded={open}
```

</details>

---

#### 26. [`src/components/custom/select.jsx:286`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/select.jsx#L286)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/select.jsx`
- **Line Number**: `286`
- **Button Label**: `Add new item`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add new item") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   285 |               <CommandGroup>
>  286 |                 <Button
   287 |                   variant="ghost"
   288 |                   size="sm"
   289 |                   className="w-full justify-start font-normal px-1.5"
```

</details>

---

#### 27. [`src/components/custom/shadcn-time-picker.jsx:147`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/shadcn-time-picker.jsx#L147)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/shadcn-time-picker.jsx`
- **Line Number**: `147`
- **Button Label**: `Now`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Now" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Now</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   146 |         <div className="flex items-center justify-between p-2 border-t border-border bg-muted/20">
>  147 |           <Button
   148 |             type="button"
   149 |             variant="ghost"
   150 |             size="sm"
```

</details>

---

#### 28. [`src/components/custom/shadcn-time-picker.jsx:163`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/shadcn-time-picker.jsx#L163)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/custom/shadcn-time-picker.jsx`
- **Line Number**: `163`
- **Button Label**: `Clear`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Clear" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Clear</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   162 |           {value && (
>  163 |             <Button
   164 |               type="button"
   165 |               variant="ghost"
   166 |               size="sm"
```

</details>

---

#### 29. [`src/components/ui/data-grid-pagination.jsx:62`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/ui/data-grid-pagination.jsx#L62)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/components/ui/data-grid-pagination.jsx`
- **Line Number**: `62`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <KeyRound className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <KeyRound className="size-4" />
  <span></span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    61 |       buttons.push(
>   62 |         <Button
    63 |           key={i}
    64 |           size="sm"
    65 |           mode="icon"
```

</details>

---

### Pages: AIM

#### 30. [`src/pages/AIM/pages/assets-pages/asset-edit/asset-edit3-components/AssetHeader.jsx:226`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/asset-edit3-components/AssetHeader.jsx#L226)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/asset-edit3-components/AssetHeader.jsx`
- **Line Number**: `226`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   225 |           <div className="flex justify-end gap-3 pt-2">
>  226 |             <Button
   227 |               variant="outline"
   228 |               onClick={() => {
   229 |                 setShowReasonModal(false);
```

</details>

---

#### 31. [`src/pages/AIM/pages/assets-pages/asset-edit/asset-edit3-components/AssetHeader.jsx:235`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/asset-edit3-components/AssetHeader.jsx#L235)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/asset-edit3-components/AssetHeader.jsx`
- **Line Number**: `235`
- **Button Label**: `Processing... / Stage for Approval`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Processing... / Stage for Approval" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Processing... / Stage for Approval</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   234 |             </Button>
>  235 |             <Button
   236 |               disabled={isUpdating || !reason.trim()}
   237 |               onClick={() => {
   238 |                 handleUpdateAsset('staged', reason);
```

</details>

---

#### 32. [`src/pages/AIM/pages/assets-pages/asset-edit/components/reason-modal.jsx:19`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/components/reason-modal.jsx#L19)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/components/reason-modal.jsx`
- **Line Number**: `19`
- **Button Label**: `Confirm`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Confirm" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Confirm</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    18 |             footer={
>   19 |                 <Button onClick={() => {
    20 |                     onDecommission(reason);
    21 |                     setOpen(false);
    22 |                     setReason("");
```

</details>

---

#### 33. [`src/pages/AIM/pages/assets-pages/asset-edit/tabs/activity-log/actions/delete-comment.jsx:19`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/activity-log/actions/delete-comment.jsx#L19)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/activity-log/actions/delete-comment.jsx`
- **Line Number**: `19`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    18 |           dialog="Are you sure you want to delete this comment? This action cannot be undone."
>   19 |           confirmButton={<Button variant="destructive" disabled={isDeleting}>Delete</Button>}
    20 |           cancelButton={<Button variant="outline">Cancel</Button>}
    21 |           onConfirm={onDelete}
    22 |           className="h-8 w-8 p-0 text-destructive hover:bg-red-500/10 hover:text-red-600 transition-colors"
```

</details>

---

#### 34. [`src/pages/AIM/pages/assets-pages/asset-edit/tabs/activity-log/actions/delete-comment.jsx:20`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/activity-log/actions/delete-comment.jsx#L20)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/activity-log/actions/delete-comment.jsx`
- **Line Number**: `20`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    19 |           confirmButton={<Button variant="destructive" disabled={isDeleting}>Delete</Button>}
>   20 |           cancelButton={<Button variant="outline">Cancel</Button>}
    21 |           onConfirm={onDelete}
    22 |           className="h-8 w-8 p-0 text-destructive hover:bg-red-500/10 hover:text-red-600 transition-colors"
    23 |           {...props}
```

</details>

---

#### 35. [`src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/ApprovalsTab.jsx:150`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/ApprovalsTab.jsx#L150)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/ApprovalsTab.jsx`
- **Line Number**: `150`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   149 |           <div className="flex justify-end gap-3 pt-2">
>  150 |             <Button
   151 |               variant="outline"
   152 |               onClick={() => setModalConfig({ open: false, status: '', approverId: '', reason: '' })}
   153 |             >
```

</details>

---

#### 36. [`src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/ApprovalsTab.jsx:156`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/ApprovalsTab.jsx#L156)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/ApprovalsTab.jsx`
- **Line Number**: `156`
- **Button Label**: `Processing... /`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Processing... /" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Processing... /</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   155 |             </Button>
>  156 |             <Button
   157 |               disabled={isUpdatingStatus || !modalConfig.reason.trim()}
   158 |               onClick={handleConfirmAction}
   159 |               appearance={modalConfig.status === 'rejected' ? 'destructive' : 'primary'}
```

</details>

---

#### 37. [`src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx:36`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx#L36)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx`
- **Line Number**: `36`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    35 |         <div className="flex justify-end gap-3 pt-2">
>   36 |           <Button
    37 |             variant="outline"
    38 |             disabled={isLoading}
    39 |             onClick={() => {
```

</details>

---

#### 38. [`src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx:46`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx#L46)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx`
- **Line Number**: `46`
- **Button Label**: `Decommissioning... / Decommission Asset`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Decommissioning... / Decommission Asset" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Decommissioning... / Decommission Asset</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    45 |           </Button>
>   46 |           <Button
    47 |             variant="destructive"
    48 |             disabled={isLoading || !reason.trim()}
    49 |             onClick={handleConfirm}
```

</details>

---

#### 39. [`src/pages/AIM/pages/assets-pages/assets/assets.jsx:150`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/assets.jsx#L150)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/assets.jsx`
- **Line Number**: `150`
- **Button Label**: `Clear Search & Return`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Clear Search & Return" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Search className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Search className="size-4" />
  <span>Clear Search & Return</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   149 |               </div>
>  150 |               <Button
   151 |                 variant="ghost"
   152 |                 size="sm"
   153 |                 onClick={() => {
```

</details>

---

#### 40. [`src/pages/AIM/pages/assets-pages/assets/components/bulk-update.jsx:200`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/bulk-update.jsx#L200)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/bulk-update.jsx`
- **Line Number**: `200`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   199 |               onConfirm={handleBulkDelete}
>  200 |               confirmButton={<Button variant="primary">Proceed</Button>}
   201 |               cancelButton={<Button variant="outline">Cancel</Button>}
   202 |             >
   203 |               Stage for Decommission
```

</details>

---

#### 41. [`src/pages/AIM/pages/assets-pages/assets/components/bulk-update.jsx:201`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/bulk-update.jsx#L201)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/bulk-update.jsx`
- **Line Number**: `201`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   200 |               confirmButton={<Button variant="primary">Proceed</Button>}
>  201 |               cancelButton={<Button variant="outline">Cancel</Button>}
   202 |             >
   203 |               Stage for Decommission
   204 |             </ButtonWithConfirm>
```

</details>

---

#### 42. [`src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/GroupNode.jsx:56`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/GroupNode.jsx#L56)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/GroupNode.jsx`
- **Line Number**: `56`
- **Button Label**: `Add Rule`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add Rule") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
    55 |         <div className="flex items-center gap-2 transition-opacity">
>   56 |           <Button
    57 |             variant="ghost"
    58 |             size="sm"
    59 |             onClick={addRule}
```

</details>

---

#### 43. [`src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/GroupNode.jsx:66`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/GroupNode.jsx#L66)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/GroupNode.jsx`
- **Line Number**: `66`
- **Button Label**: `Add Group`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add Group") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
    65 |           {depth < 3 && (
>   66 |             <Button
    67 |               variant="ghost"
    68 |               size="sm"
    69 |               onClick={addGroup}
```

</details>

---

#### 44. [`src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/GroupNode.jsx:77`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/GroupNode.jsx#L77)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/GroupNode.jsx`
- **Line Number**: `77`
- **Button Label**: `Remove`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Remove" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Remove</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    76 |           {!isOnly && (
>   77 |             <Button
    78 |               variant="ghost"
    79 |               size="sm"
    80 |               onClick={onRemove}
```

</details>

---

#### 45. [`src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/LogicToggle.jsx:9`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/LogicToggle.jsx#L9)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard/components/LogicToggle.jsx`
- **Line Number**: `9`
- **Button Label**: `{op}`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "{op}" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>{op}</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
     8 |       {['AND', 'OR', 'NOT'].map((op) => (
>    9 |         <Button
    10 |           key={op}
    11 |           variant={value === op ? 'primary' : 'ghost'}
    12 |           size="sm"
```

</details>

---

#### 46. [`src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx:192`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx#L192)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx`
- **Line Number**: `192`
- **Button Label**: `Reset`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Reset" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RotateCcw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RotateCcw className="size-4" />
  <span>Reset</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   191 |           </div>
>  192 |           <Button
   193 |             variant="ghost"
   194 |             size="sm"
   195 |             onClick={reset}
```

</details>

---

#### 47. [`src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx:275`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx#L275)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx`
- **Line Number**: `275`
- **Button Label**: `Saving... / Save Query`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon & Invalid Ghost Variant**: This button represents an actionable operation ("Saving... / Save Query") but is rendered with `variant="ghost"` instead of `variant="primary"`, and is missing a contextually relevant icon.

**Suggested Change**:

Update the Button to use `variant="primary"` and include <Save className="size-4" /> from `lucide-react` alongside the label:
```jsx
<Button variant="primary" ...>
  <Save className="size-4" />
  <span>Saving... / Save Query</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   274 |             {isSaveToggle && (
>  275 |               <Button
   276 |                 variant="ghost"
   277 |                 onClick={handleSaveOnly}
   278 |                 disabled={isCreating || !isQueryValid}
```

</details>

---

#### 48. [`src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx:283`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx#L283)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx`
- **Line Number**: `283`
- **Button Label**: `Cancel`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   282 |             )}
>  283 |             <Button
   284 |               variant="ghost"
   285 |               onClick={() => setOpen(false)}
   286 |             >
```

</details>

---

#### 49. [`src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx:289`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx#L289)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx`
- **Line Number**: `289`
- **Button Label**: `Applying... / Apply Filter`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Applying... / Apply Filter" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Filter className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Filter className="size-4" />
  <span>Applying... / Apply Filter</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   288 |             </Button>
>  289 |             <Button
   290 |               variant="primary"
   291 |               disabled={isSearching || isCreating || !isQueryValid}
   292 |               onClick={handleApplyFilter}
```

</details>

---

#### 50. [`src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx:318`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx#L318)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/assets/components/modals/query-wizard-modal.jsx`
- **Line Number**: `318`
- **Button Label**: `Delete Query`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete Query" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete Query</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   317 |         }}
>  318 |         confirmButton={<Button variant="destructive">Delete Query</Button>}
   319 |       />
   320 |     </>
   321 |   );
```

</details>

---

#### 51. [`src/pages/AIM/pages/assets-pages/licenses/components/add-license-modal.jsx:149`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/licenses/components/add-license-modal.jsx#L149)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/licenses/components/add-license-modal.jsx`
- **Line Number**: `149`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   148 |         <div className="flex items-center justify-end gap-2 pt-2">
>  149 |           <Button
   150 |             variant="outline"
   151 |             onClick={() => {
   152 |               setOpen(false);
```

</details>

---

#### 52. [`src/pages/AIM/pages/assets-pages/vendors/components/add-vendor-modal.jsx:124`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/vendors/components/add-vendor-modal.jsx#L124)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/assets-pages/vendors/components/add-vendor-modal.jsx`
- **Line Number**: `124`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   123 |         <div className="flex items-center justify-end gap-2 pt-2">
>  124 |           <Button
   125 |             variant="outline"
   126 |             onClick={() => {
   127 |               setOpen(false);
```

</details>

---

#### 53. [`src/pages/AIM/pages/business-unit-details/components/actions/delete-business-unit.jsx:47`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-unit-details/components/actions/delete-business-unit.jsx#L47)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-unit-details/components/actions/delete-business-unit.jsx`
- **Line Number**: `47`
- **Button Label**: `Proceed`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    46 |         confirmButton={
>   47 |           <Button variant="destructive" disabled={isDeleting}>
    48 |             Proceed
    49 |           </Button>
    50 |         }
```

</details>

---

#### 54. [`src/pages/AIM/pages/business-unit-details/components/actions/delete-business-unit.jsx:51`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-unit-details/components/actions/delete-business-unit.jsx#L51)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-unit-details/components/actions/delete-business-unit.jsx`
- **Line Number**: `51`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    50 |         }
>   51 |         cancelButton={<Button variant="outline">Cancel</Button>}
    52 |       >
    53 |         <Trash2 className='text-destructive' />
    54 |       </ButtonWithConfirm>
```

</details>

---

#### 55. [`src/pages/AIM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx:34`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx#L34)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx`
- **Line Number**: `34`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    33 |         onConfirm={handleRemove}
>   34 |         confirmButton={<Button variant="primary">Proceed</Button>}
    35 |         cancelButton={<Button variant="outline">Cancel</Button>}
    36 |         className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    37 |         {...props}
```

</details>

---

#### 56. [`src/pages/AIM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx:35`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx#L35)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx`
- **Line Number**: `35`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    34 |         confirmButton={<Button variant="primary">Proceed</Button>}
>   35 |         cancelButton={<Button variant="outline">Cancel</Button>}
    36 |         className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    37 |         {...props}
    38 |       >
```

</details>

---

#### 57. [`src/pages/AIM/pages/business-units/components/dropdowns/business-units-dropdown.jsx:53`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-units/components/dropdowns/business-units-dropdown.jsx#L53)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-units/components/dropdowns/business-units-dropdown.jsx`
- **Line Number**: `53`
- **Button Label**: `Proceed`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    52 |             confirmButton={
>   53 |               <Button variant="destructive" disabled={isDeleting}>
    54 |                 Proceed
    55 |               </Button>
    56 |             }
```

</details>

---

#### 58. [`src/pages/AIM/pages/business-units/components/dropdowns/business-units-dropdown.jsx:57`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-units/components/dropdowns/business-units-dropdown.jsx#L57)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-units/components/dropdowns/business-units-dropdown.jsx`
- **Line Number**: `57`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    56 |             }
>   57 |             cancelButton={<Button variant="outline">Cancel</Button>}
    58 |             className="w-full justify-start !font-normal hover:bg-red-200/20 cursor-pointer !text-inherit px-2 py-1.5 text-sm h-8"
    59 |           >
    60 |             <span className='text-destructive'>
```

</details>

---

#### 59. [`src/pages/AIM/pages/business-units/components/modals/edit-business-unit-modal.jsx:168`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-units/components/modals/edit-business-unit-modal.jsx#L168)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/business-units/components/modals/edit-business-unit-modal.jsx`
- **Line Number**: `168`
- **Button Label**: `Updating... / Update Business Unit`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Updating... / Update Business Unit" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Updating... / Update Business Unit</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   167 |           <div className="flex justify-end pt-2">
>  168 |             <Button onClick={handleUpdate} disabled={isLoading}>
   169 |               {isLoading ? 'Updating...' : 'Update Business Unit'}
   170 |             </Button>
   171 |           </div>
```

</details>

---

#### 60. [`src/pages/AIM/pages/engine/classifers/classifers-page.jsx:75`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/classifers-page.jsx#L75)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/classifers-page.jsx`
- **Line Number**: `75`
- **Button Label**: `Explore signal library`
- **Current Variant**: `secondary`
- **Issue**: **Missing Icon**: The button with label "Explore signal library" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Search className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Search className="size-4" />
  <span>Explore signal library</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    74 |               <Link to="/assetinventory/engine/policy/library">
>   75 |                 <Button variant="secondary">
    76 |                   Explore signal library
    77 |                 </Button>
    78 |               </Link>
```

</details>

---

#### 61. [`src/pages/AIM/pages/engine/classifers/classifers-page.jsx:126`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/classifers-page.jsx#L126)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/classifers-page.jsx`
- **Line Number**: `126`
- **Button Label**: `Explore signal library`
- **Current Variant**: `secondary`
- **Issue**: **Missing Icon**: The button with label "Explore signal library" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Search className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Search className="size-4" />
  <span>Explore signal library</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   125 |                       <Link to="/assetinventory/engine/policy/library">
>  126 |                         <Button variant="secondary">
   127 |                           Explore signal library
   128 |                         </Button>
   129 |                       </Link>
```

</details>

---

#### 62. [`src/pages/AIM/pages/engine/classifers/components/classifier-card.jsx:110`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/classifier-card.jsx#L110)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/classifier-card.jsx`
- **Line Number**: `110`
- **Button Label**: `Delete`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   109 |                       onConfirm={() => onDelete(classifier._id)}
>  110 |                       confirmButton={<Button variant="primary">Delete</Button>}
   111 |                       cancelButton={<Button variant="outline">Cancel</Button>}
   112 |                       className="w-full justify-start h-8 px-2 text-destructive hover:text-destructive font-normal"
   113 |                     >
```

</details>

---

#### 63. [`src/pages/AIM/pages/engine/classifers/components/classifier-card.jsx:111`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/classifier-card.jsx#L111)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/classifier-card.jsx`
- **Line Number**: `111`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   110 |                       confirmButton={<Button variant="primary">Delete</Button>}
>  111 |                       cancelButton={<Button variant="outline">Cancel</Button>}
   112 |                       className="w-full justify-start h-8 px-2 text-destructive hover:text-destructive font-normal"
   113 |                     >
   114 |                       Delete
```

</details>

---

#### 64. [`src/pages/AIM/pages/engine/classifers/components/classifier-jobs-tab.jsx:86`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/classifier-jobs-tab.jsx#L86)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/classifier-jobs-tab.jsx`
- **Line Number**: `86`
- **Button Label**: `Cancel`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    85 |               }}
>   86 |               confirmButton={<Button variant="destructive" disabled={isUpdating}>Cancel</Button>}
    87 |               cancelButton={<Button variant="outline">Back</Button>}
    88 |               className="w-full justify-start font-normal h-8 px-2 py-1.5 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
    89 |             >
```

</details>

---

#### 65. [`src/pages/AIM/pages/engine/classifers/components/classifier-jobs-tab.jsx:87`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/classifier-jobs-tab.jsx#L87)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/classifier-jobs-tab.jsx`
- **Line Number**: `87`
- **Button Label**: `Back`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Back" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowLeft className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowLeft className="size-4" />
  <span>Back</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    86 |               confirmButton={<Button variant="destructive" disabled={isUpdating}>Cancel</Button>}
>   87 |               cancelButton={<Button variant="outline">Back</Button>}
    88 |               className="w-full justify-start font-normal h-8 px-2 py-1.5 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
    89 |             >
    90 |               Cancel
```

</details>

---

#### 66. [`src/pages/AIM/pages/engine/classifers/components/dropdowns/classifers-list-dropdown.jsx:80`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/dropdowns/classifers-list-dropdown.jsx#L80)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/dropdowns/classifers-list-dropdown.jsx`
- **Line Number**: `80`
- **Button Label**: `Proceed`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    79 |             confirmButton={
>   80 |               <Button variant="destructive" disabled={isDeleting}>
    81 |                 Proceed
    82 |               </Button>
    83 |             }
```

</details>

---

#### 67. [`src/pages/AIM/pages/engine/classifers/components/dropdowns/classifers-list-dropdown.jsx:84`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/dropdowns/classifers-list-dropdown.jsx#L84)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/dropdowns/classifers-list-dropdown.jsx`
- **Line Number**: `84`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    83 |             }
>   84 |             cancelButton={<Button variant="outline">Cancel</Button>}
    85 |             className="w-full justify-start !font-normal !hover:bg-transparent !bg-transparent !text-inherit px-2 py-1.5 text-sm h-8"
    86 |           >
    87 |             Delete
```

</details>

---

#### 68. [`src/pages/AIM/pages/engine/classifers/components/rule-editor/components/actions.jsx:175`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/rule-editor/components/actions.jsx#L175)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/rule-editor/components/actions.jsx`
- **Line Number**: `175`
- **Button Label**: `+ Field`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "+ Field" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>+ Field</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   174 |             })}
>  175 |             <Button
   176 |                 size="sm"
   177 |                 variant="outline"
   178 |                 onClick={() => addAction()}
```

</details>

---

#### 69. [`src/pages/AIM/pages/engine/classifers/components/rule-editor/components/classifier-alert-channels.jsx:197`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/rule-editor/components/classifier-alert-channels.jsx#L197)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/rule-editor/components/classifier-alert-channels.jsx`
- **Line Number**: `197`
- **Button Label**: `+ Channel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "+ Channel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>+ Channel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   196 |             })}
>  197 |             <Button size="sm" variant="outline" onClick={addChannel} className="mt-2 text-xs h-7">
   198 |                 + Channel
   199 |             </Button>
   200 |         </div>
```

</details>

---

#### 70. [`src/pages/AIM/pages/engine/classifers/components/rule-editor/components/match-conditions.jsx:107`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/rule-editor/components/match-conditions.jsx#L107)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/classifers/components/rule-editor/components/match-conditions.jsx`
- **Line Number**: `107`
- **Button Label**: `+ Condition`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "+ Condition" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>+ Condition</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   106 |                     <CardTitle>Conditions</CardTitle>
>  107 |                     <Button
   108 |                         size="sm"
   109 |                         variant="outline"
   110 |                         onClick={() => addCondition()}
```

</details>

---

#### 71. [`src/pages/AIM/pages/engine/components/actions/delete-rule.jsx:27`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/components/actions/delete-rule.jsx#L27)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/components/actions/delete-rule.jsx`
- **Line Number**: `27`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    26 |         onConfirm={() => handleDeleteScan()}
>   27 |         confirmButton={<Button variant="primary">Proceed</Button>}
    28 |         cancelButton={<Button variant="outline">Cancel</Button>}
    29 |         className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    30 |         {...props}
```

</details>

---

#### 72. [`src/pages/AIM/pages/engine/components/actions/delete-rule.jsx:28`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/components/actions/delete-rule.jsx#L28)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/components/actions/delete-rule.jsx`
- **Line Number**: `28`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    27 |         confirmButton={<Button variant="primary">Proceed</Button>}
>   28 |         cancelButton={<Button variant="outline">Cancel</Button>}
    29 |         className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    30 |         {...props}
    31 |       >
```

</details>

---

#### 73. [`src/pages/AIM/pages/engine/components/actions/execute-single-policy.jsx:22`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/components/actions/execute-single-policy.jsx#L22)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/engine/components/actions/execute-single-policy.jsx`
- **Line Number**: `22`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("execute single policy") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
    21 |     return (
>   22 |         <Button
    23 |             disabled={isExecutingPolicy}
    24 |             onClick={handleExecuteSinglePolicy}
    25 |             variant="ghost"
```

</details>

---

#### 74. [`src/pages/AIM/pages/settings/components/agent-settings.jsx:320`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/agent-settings.jsx#L320)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/agent-settings.jsx`
- **Line Number**: `320`
- **Button Label**: `Discard changes`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Discard changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Discard changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   319 |           <div className="flex items-center justify-end gap-3">
>  320 |             <Button variant="outline" onClick={handleDiscard}>
   321 |               Discard changes
   322 |             </Button>
   323 |             <Button onClick={handleSave}>
```

</details>

---

#### 75. [`src/pages/AIM/pages/settings/components/agent-settings.jsx:323`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/agent-settings.jsx#L323)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/agent-settings.jsx`
- **Line Number**: `323`
- **Button Label**: `Save collection settings`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save collection settings" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save collection settings</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   322 |             </Button>
>  323 |             <Button onClick={handleSave}>
   324 |               Save collection settings
   325 |             </Button>
   326 |           </div>
```

</details>

---

#### 76. [`src/pages/AIM/pages/settings/components/dropdowns/custom-field-dropdown.jsx:57`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/dropdowns/custom-field-dropdown.jsx#L57)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/dropdowns/custom-field-dropdown.jsx`
- **Line Number**: `57`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    56 |               confirmButton={
>   57 |                 <Button variant="destructive" disabled={isDeleting}>
    58 |                   Delete
    59 |                 </Button>
    60 |               }
```

</details>

---

#### 77. [`src/pages/AIM/pages/settings/components/dropdowns/custom-field-dropdown.jsx:61`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/dropdowns/custom-field-dropdown.jsx#L61)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/dropdowns/custom-field-dropdown.jsx`
- **Line Number**: `61`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    60 |               }
>   61 |               cancelButton={<Button variant="outline">Cancel</Button>}
    62 |               className="w-full justify-start !font-normal hover:bg-red-200/20 px-2 py-1.5 text-sm h-8"
    63 |             >
    64 |               <span className="text-destructive">Delete</span>
```

</details>

---

#### 78. [`src/pages/AIM/pages/settings/components/dropdowns/registered-agents-dropdown.jsx:48`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/dropdowns/registered-agents-dropdown.jsx#L48)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/dropdowns/registered-agents-dropdown.jsx`
- **Line Number**: `48`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    47 |             confirmButton={
>   48 |               <Button variant="destructive" disabled={isDeleting}>
    49 |                 Delete
    50 |               </Button>
    51 |             }
```

</details>

---

#### 79. [`src/pages/AIM/pages/settings/components/dropdowns/registered-agents-dropdown.jsx:52`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/dropdowns/registered-agents-dropdown.jsx#L52)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/dropdowns/registered-agents-dropdown.jsx`
- **Line Number**: `52`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    51 |             }
>   52 |             cancelButton={<Button variant="outline">Cancel</Button>}
    53 |             className="w-full justify-start !font-normal cursor-pointer !text-inherit px-2 py-1.5 text-sm h-8"
    54 |           >
    55 |             <span className="text-destructive">Delete</span>
```

</details>

---

#### 80. [`src/pages/AIM/pages/settings/components/modals/create-tag-modal.jsx:121`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/modals/create-tag-modal.jsx#L121)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/modals/create-tag-modal.jsx`
- **Line Number**: `121`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   120 |         <div className="flex items-center justify-end gap-2 w-full">
>  121 |           <Button
   122 |             variant="outline"
   123 |             onClick={() => setOpen(false)}
   124 |             disabled={isCreating || isUpdating}
```

</details>

---

#### 81. [`src/pages/AIM/pages/settings/components/modals/define-field-modal.jsx:123`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/modals/define-field-modal.jsx#L123)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/modals/define-field-modal.jsx`
- **Line Number**: `123`
- **Button Label**: `Cancel`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   122 |     <div className="flex justify-end gap-2 w-full">
>  123 |       <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
   124 |       <Button variant="primary" onClick={handleSave} disabled={isCreating || isUpdating}>
   125 |         {isEditing ? 'Update field' : 'Create field'}
   126 |       </Button>
```

</details>

---

#### 82. [`src/pages/AIM/pages/settings/components/modals/define-field-modal.jsx:124`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/modals/define-field-modal.jsx#L124)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/modals/define-field-modal.jsx`
- **Line Number**: `124`
- **Button Label**: `Update field / Create field`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Update field / Create field" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Update field / Create field</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   123 |       <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
>  124 |       <Button variant="primary" onClick={handleSave} disabled={isCreating || isUpdating}>
   125 |         {isEditing ? 'Update field' : 'Create field'}
   126 |       </Button>
   127 |     </div>
```

</details>

---

#### 83. [`src/pages/AIM/pages/settings/components/modals/define-field-modal.jsx:243`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/modals/define-field-modal.jsx#L243)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/modals/define-field-modal.jsx`
- **Line Number**: `243`
- **Button Label**: `Add`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Add" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Add</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   242 |               />
>  243 |               <Button type="button" variant="outline" onClick={handleAddOption}>Add</Button>
   244 |             </div>
   245 |             {options.length > 0 && (
   246 |               <div className="flex flex-wrap gap-2 mt-2">
```

</details>

---

#### 84. [`src/pages/AIM/pages/settings/components/tags-settings.jsx:160`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/tags-settings.jsx#L160)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/tags-settings.jsx`
- **Line Number**: `160`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   159 |                         dialog={`Are you sure you want to delete the tag "${name}"? This action cannot be undone.`}
>  160 |                         confirmButton={<Button variant="destructive">Delete</Button>}
   161 |                         cancelButton={<Button variant="outline">Cancel</Button>}
   162 |                         className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-transparent"
   163 |                       >
```

</details>

---

#### 85. [`src/pages/AIM/pages/settings/components/tags-settings.jsx:161`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/tags-settings.jsx#L161)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/AIM/pages/settings/components/tags-settings.jsx`
- **Line Number**: `161`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   160 |                         confirmButton={<Button variant="destructive">Delete</Button>}
>  161 |                         cancelButton={<Button variant="outline">Cancel</Button>}
   162 |                         className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-transparent"
   163 |                       >
   164 |                         <X className="size-4" />
```

</details>

---

### Pages: ASM

#### 86. [`src/pages/ASM/attack-surface/asset-edit/asset-edit3-components/modals/CreateExposureModal.jsx:75`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/asset-edit3-components/modals/CreateExposureModal.jsx#L75)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/asset-edit3-components/modals/CreateExposureModal.jsx`
- **Line Number**: `75`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    74 |         <div className="flex items-center justify-end gap-2 w-full">
>   75 |           <Button
    76 |             variant="outline"
    77 |             onClick={() => {
    78 |               setIsModalOpen(false);
```

</details>

---

#### 87. [`src/pages/ASM/attack-surface/asset-edit/asset-edit3-components/modals/CreateExposureModal.jsx:84`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/asset-edit3-components/modals/CreateExposureModal.jsx#L84)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/asset-edit3-components/modals/CreateExposureModal.jsx`
- **Line Number**: `84`
- **Button Label**: `Creating... / Create Exposure`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Creating... / Create Exposure" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Creating... / Create Exposure</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    83 |           </Button>
>   84 |           <Button onClick={handleSubmit} disabled={isLoading}>
    85 |             {isLoading ? 'Creating...' : 'Create Exposure'}
    86 |           </Button>
    87 |         </div>
```

</details>

---

#### 88. [`src/pages/ASM/attack-surface/asset-edit/components/reason-modal.jsx:19`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/components/reason-modal.jsx#L19)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/components/reason-modal.jsx`
- **Line Number**: `19`
- **Button Label**: `Confirm`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Confirm" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Confirm</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    18 |             footer={
>   19 |                 <Button onClick={() => {
    20 |                     onDecommission(reason);
    21 |                     setOpen(false);
    22 |                     setReason("");
```

</details>

---

#### 89. [`src/pages/ASM/attack-surface/asset-edit/tabs/activity-log/actions/delete-comment.jsx:19`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/activity-log/actions/delete-comment.jsx#L19)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/activity-log/actions/delete-comment.jsx`
- **Line Number**: `19`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    18 |           dialog="Are you sure you want to delete this comment? This action cannot be undone."
>   19 |           confirmButton={<Button variant="destructive" disabled={isDeleting}>Delete</Button>}
    20 |           cancelButton={<Button variant="outline">Cancel</Button>}
    21 |           onConfirm={onDelete}
    22 |           className="h-8 w-8 p-0 text-destructive hover:bg-red-500/10 hover:text-red-600 transition-colors"
```

</details>

---

#### 90. [`src/pages/ASM/attack-surface/asset-edit/tabs/activity-log/actions/delete-comment.jsx:20`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/activity-log/actions/delete-comment.jsx#L20)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/activity-log/actions/delete-comment.jsx`
- **Line Number**: `20`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    19 |           confirmButton={<Button variant="destructive" disabled={isDeleting}>Delete</Button>}
>   20 |           cancelButton={<Button variant="outline">Cancel</Button>}
    21 |           onConfirm={onDelete}
    22 |           className="h-8 w-8 p-0 text-destructive hover:bg-red-500/10 hover:text-red-600 transition-colors"
    23 |           {...props}
```

</details>

---

#### 91. [`src/pages/ASM/attack-surface/asset-edit/tabs/approvals/ApprovalsTab.jsx:150`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/approvals/ApprovalsTab.jsx#L150)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/approvals/ApprovalsTab.jsx`
- **Line Number**: `150`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   149 |           <div className="flex justify-end gap-3 pt-2">
>  150 |             <Button
   151 |               variant="outline"
   152 |               onClick={() => setModalConfig({ open: false, status: '', approverId: '', reason: '' })}
   153 |             >
```

</details>

---

#### 92. [`src/pages/ASM/attack-surface/asset-edit/tabs/approvals/ApprovalsTab.jsx:156`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/approvals/ApprovalsTab.jsx#L156)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/approvals/ApprovalsTab.jsx`
- **Line Number**: `156`
- **Button Label**: `Processing... /`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Processing... /" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Processing... /</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   155 |             </Button>
>  156 |             <Button
   157 |               disabled={isUpdatingStatus || !modalConfig.reason.trim()}
   158 |               onClick={handleConfirmAction}
   159 |               appearance={modalConfig.status === 'rejected' ? 'destructive' : 'primary'}
```

</details>

---

#### 93. [`src/pages/ASM/attack-surface/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx:36`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx#L36)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx`
- **Line Number**: `36`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    35 |         <div className="flex justify-end gap-3 pt-2">
>   36 |           <Button
    37 |             variant="outline"
    38 |             disabled={isLoading}
    39 |             onClick={() => {
```

</details>

---

#### 94. [`src/pages/ASM/attack-surface/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx:46`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx#L46)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/asset-edit/tabs/approvals/components/modals/DecommissionAssetModal.jsx`
- **Line Number**: `46`
- **Button Label**: `Decommissioning... / Decommission Asset`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Decommissioning... / Decommission Asset" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Decommissioning... / Decommission Asset</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    45 |           </Button>
>   46 |           <Button
    47 |             variant="destructive"
    48 |             disabled={isLoading || !reason.trim()}
    49 |             onClick={handleConfirm}
```

</details>

---

#### 95. [`src/pages/ASM/attack-surface/components/table/asset-table.jsx:528`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/components/table/asset-table.jsx#L528)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/components/table/asset-table.jsx`
- **Line Number**: `528`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   527 |           <DialogFooter className="flex gap-2 justify-end">
>  528 |             <Button
   529 |               variant="outline"
   530 |               onClick={handleModalCancel}
   531 |               disabled={isSubmitting}
```

</details>

---

#### 96. [`src/pages/ASM/attack-surface/components/table/asset-table.jsx:536`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/components/table/asset-table.jsx#L536)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/components/table/asset-table.jsx`
- **Line Number**: `536`
- **Button Label**: `Submitting... / Submit`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Submitting... / Submit" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Submitting... / Submit</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   535 |             </Button>
>  536 |             <Button
   537 |               onClick={handleSubmit(onSubmit)}
   538 |               disabled={isSubmitting || !isValid}
   539 |               size="sm"
```

</details>

---

#### 97. [`src/pages/ASM/attack-surface/technologies/components/technology-card.jsx:314`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/technologies/components/technology-card.jsx#L314)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/technologies/components/technology-card.jsx`
- **Line Number**: `314`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   313 |           <div className="flex gap-2 justify-end">
>  314 |             <Button
   315 |               variant="outline"
   316 |               onClick={() => setActionOpen(false)}
   317 |               disabled={isSubmitting}
```

</details>

---

#### 98. [`src/pages/ASM/attack-surface/technologies/components/technology-card.jsx:321`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/technologies/components/technology-card.jsx#L321)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/technologies/components/technology-card.jsx`
- **Line Number**: `321`
- **Button Label**: `Submitting... / Submit`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Submitting... / Submit" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Submitting... / Submit</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   320 |             </Button>
>  321 |             <Button onClick={handleActionSubmit} disabled={isSubmitting}>
   322 |               {isSubmitting ? 'Submitting...' : 'Submit'}
   323 |             </Button>
   324 |           </div>
```

</details>

---

#### 99. [`src/pages/ASM/attack-surface/web-servers/components/card.jsx:415`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/web-servers/components/card.jsx#L415)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/web-servers/components/card.jsx`
- **Line Number**: `415`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   414 |           <DialogFooter className="flex gap-2 justify-end">
>  415 |             <Button
   416 |               variant="outline"
   417 |               onClick={handleModalCancel}
   418 |               disabled={isSubmitting}
```

</details>

---

#### 100. [`src/pages/ASM/attack-surface/web-servers/components/card.jsx:423`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/web-servers/components/card.jsx#L423)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/attack-surface/web-servers/components/card.jsx`
- **Line Number**: `423`
- **Button Label**: `Submitting... / Submit`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Submitting... / Submit" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Submitting... / Submit</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   422 |             </Button>
>  423 |             <Button
   424 |               onClick={handleModalSubmit}
   425 |               disabled={isSubmitting}
   426 |               size="sm"
```

</details>

---

#### 101. [`src/pages/ASM/blacklist-rules/components/blacklist-rules-empty-state.jsx:19`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/blacklist-rules/components/blacklist-rules-empty-state.jsx#L19)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/blacklist-rules/components/blacklist-rules-empty-state.jsx`
- **Line Number**: `19`
- **Button Label**: `Clear All Filters`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Clear All Filters" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Filter className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Filter className="size-4" />
  <span>Clear All Filters</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    18 |           engage={
>   19 |             <Button
    20 |               variant="outline"
    21 |               onClick={onResetFilters || (() => window.location.reload())}
    22 |             >
```

</details>

---

#### 102. [`src/pages/ASM/blacklist-rules/guided-editor/components/condition-group.jsx:86`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/blacklist-rules/guided-editor/components/condition-group.jsx#L86)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/blacklist-rules/guided-editor/components/condition-group.jsx`
- **Line Number**: `86`
- **Button Label**: `Add Condition`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add Condition") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
    85 |         <div className="flex items-center gap-3">
>   86 |           <Button
    87 |             type="button"
    88 |             size="sm"
    89 |             variant="ghost"
```

</details>

---

#### 103. [`src/pages/ASM/blacklist-rules/guided-editor/components/condition-group.jsx:95`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/blacklist-rules/guided-editor/components/condition-group.jsx#L95)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/blacklist-rules/guided-editor/components/condition-group.jsx`
- **Line Number**: `95`
- **Button Label**: `Add Group`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add Group") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
    94 |           </Button>
>   95 |           <Button
    96 |             type="button"
    97 |             size="sm"
    98 |             variant="ghost"
```

</details>

---

#### 104. [`src/pages/ASM/exposures/components/asm-bulk-update.jsx:134`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/asm-bulk-update.jsx#L134)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/asm-bulk-update.jsx`
- **Line Number**: `134`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   133 |                     className="text-destructive hover:text-destructive hover:!bg-red-300/20"
>  134 |                     confirmButton={<Button variant="primary">Proceed</Button>}
   135 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   136 |                 >
   137 |                     <Trash2 size={14} className="text-destructive" />
```

</details>

---

#### 105. [`src/pages/ASM/exposures/components/asm-bulk-update.jsx:135`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/asm-bulk-update.jsx#L135)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/asm-bulk-update.jsx`
- **Line Number**: `135`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   134 |                     confirmButton={<Button variant="primary">Proceed</Button>}
>  135 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   136 |                 >
   137 |                     <Trash2 size={14} className="text-destructive" />
   138 |                 </ButtonWithConfirm>
```

</details>

---

#### 106. [`src/pages/ASM/exposures/components/edit-exposure.jsx:69`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/edit-exposure.jsx#L69)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/edit-exposure.jsx`
- **Line Number**: `69`
- **Button Label**: `Cancel`
- **Current Variant**: `blank`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    68 |                 <div className="w-full flex items-center gap-2 justify-end">
>   69 |                     <Button variant="blank" onClick={() => setShowEdit(false)}>
    70 |                         Cancel
    71 |                     </Button>
    72 |                     <Button variant="primary" onClick={handleUpdate}>
```

</details>

---

#### 107. [`src/pages/ASM/exposures/components/exposure-list.jsx:210`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/exposure-list.jsx#L210)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/exposure-list.jsx`
- **Line Number**: `210`
- **Button Label**: `Confirm`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Confirm" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Confirm</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   209 |             confirmButton={
>  210 |               <Button variant="primary" disabled={isSyncing}>
   211 |                 Confirm
   212 |               </Button>
   213 |             }
```

</details>

---

#### 108. [`src/pages/ASM/exposures/components/exposure-list.jsx:214`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/exposure-list.jsx#L214)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/exposure-list.jsx`
- **Line Number**: `214`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   213 |             }
>  214 |             cancelButton={<Button variant="outline">Cancel</Button>}
   215 |           >
   216 |             <RefreshCcw size={12} className={isSyncing ? 'animate-spin' : ''} />
   217 |             Escalate Ticket
```

</details>

---

#### 109. [`src/pages/ASM/exposures/components/modals/exposure-info-modal.jsx:460`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/modals/exposure-info-modal.jsx#L460)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/components/modals/exposure-info-modal.jsx`
- **Line Number**: `460`
- **Button Label**: `Confirm`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Confirm" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Confirm</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   459 |                     confirmButton={
>  460 |                       <Button disabled={isSyncing}>Confirm</Button>
   461 |                     }
   462 |                   >
   463 |                     <RefreshCcw
```

</details>

---

#### 110. [`src/pages/ASM/exposures/exposures.jsx:100`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx#L100)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx`
- **Line Number**: `100`
- **Button Label**: `Analyze`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Analyze" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Search className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Search className="size-4" />
  <span>Analyze</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    99 |                 confirmButton={
>  100 |                   <Button variant="primary" disabled={shouldDisableAiBtn}>
   101 |                     Analyze
   102 |                   </Button>
   103 |                 }
```

</details>

---

#### 111. [`src/pages/ASM/exposures/exposures.jsx:104`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx#L104)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx`
- **Line Number**: `104`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   103 |                 }
>  104 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   105 |               >
   106 |                 {isAiAnalysisRunning ? <Loader2 className="animate-spin" /> : <Sparkles />}
   107 |                 {isAiAnalysisRunning ? 'Analyzing...' : 'Run AI Analysis'}
```

</details>

---

#### 112. [`src/pages/ASM/exposures/exposures.jsx:189`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx#L189)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx`
- **Line Number**: `189`
- **Button Label**: `Analyze`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Analyze" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Search className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Search className="size-4" />
  <span>Analyze</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   188 |               confirmButton={
>  189 |                 <Button variant="primary" disabled={shouldDisableAiBtn}>
   190 |                   Analyze
   191 |                 </Button>
   192 |               }
```

</details>

---

#### 113. [`src/pages/ASM/exposures/exposures.jsx:193`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx#L193)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx`
- **Line Number**: `193`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   192 |               }
>  193 |               cancelButton={<Button variant="outline">Cancel</Button>}
   194 |             >
   195 |               {isAiAnalysisRunning ? <Loader2 className="animate-spin" /> : <Sparkles />}
   196 |               {isAiAnalysisRunning ? 'Analyzing...' : 'AI Analysis'}
```

</details>

---

#### 114. [`src/pages/ASM/exposures/exposures.jsx:226`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx#L226)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx`
- **Line Number**: `226`
- **Button Label**: `Export`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Export" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Download className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Download className="size-4" />
  <span>Export</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   225 |               confirmButton={
>  226 |                 <Button variant="primary">
   227 |                   Export
   228 |                 </Button>
   229 |               }
```

</details>

---

#### 115. [`src/pages/ASM/exposures/exposures.jsx:230`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx#L230)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/exposures/exposures.jsx`
- **Line Number**: `230`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   229 |               }
>  230 |               cancelButton={<Button variant="outline">Cancel</Button>}
   231 |             >
   232 |               <Upload /> Export
   233 |             </ButtonWithConfirm>
```

</details>

---

#### 116. [`src/pages/ASM/integrations/components/asm-configrations-form.jsx:392`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/integrations/components/asm-configrations-form.jsx#L392)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/integrations/components/asm-configrations-form.jsx`
- **Line Number**: `392`
- **Button Label**: `Remove`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Remove" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Remove</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   391 |                   confirmVariant="destructive"
>  392 |                   confirmButton={<Button variant="destructive">Remove</Button>}
   393 |                 >
   394 |                   <X className="w-4 h-4 text-destructive" />
   395 |                 </ConfirmationDialog>
```

</details>

---

#### 117. [`src/pages/ASM/integrations/components/asm-configrations-form.jsx:411`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/integrations/components/asm-configrations-form.jsx#L411)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/integrations/components/asm-configrations-form.jsx`
- **Line Number**: `411`
- **Button Label**: `Once`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Once" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Once</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   410 |             <div className="flex flex-row gap-3">
>  411 |               <Button
   412 |                 variant={frequency === 'Once' ? 'secondary' : 'outline'}
   413 |                 onClick={() => {
   414 |                   setFrequency('Once');
```

</details>

---

#### 118. [`src/pages/ASM/integrations/components/asm-configrations-form.jsx:422`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/integrations/components/asm-configrations-form.jsx#L422)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/integrations/components/asm-configrations-form.jsx`
- **Line Number**: `422`
- **Button Label**: `Daily`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Daily" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Daily</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   421 |               </Button>
>  422 |               <Button
   423 |                 variant={frequency === 'Daily' ? 'secondary' : 'outline'}
   424 |                 onClick={() => {
   425 |                   setFrequency('Daily');
```

</details>

---

#### 119. [`src/pages/ASM/integrations/components/asm-configrations-form.jsx:433`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/integrations/components/asm-configrations-form.jsx#L433)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/integrations/components/asm-configrations-form.jsx`
- **Line Number**: `433`
- **Button Label**: `Weekly`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Weekly" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Weekly</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   432 |               </Button>
>  433 |               <Button
   434 |                 variant={frequency === 'Weekly' ? 'secondary' : 'outline'}
   435 |                 onClick={() => {
   436 |                   setFrequency('Weekly');
```

</details>

---

#### 120. [`src/pages/ASM/post-asm-rule/guided-rule-editor.jsx:514`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/post-asm-rule/guided-rule-editor.jsx#L514)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/post-asm-rule/guided-rule-editor.jsx`
- **Line Number**: `514`
- **Button Label**: `+ Condition`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "+ Condition" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>+ Condition</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   513 |                     <CardTitle>Conditions</CardTitle>
>  514 |                     <Button
   515 |                       size="sm"
   516 |                       variant="outline"
   517 |                       onClick={() => addCondition(currentRule.id)}
```

</details>

---

#### 121. [`src/pages/ASM/reports/components/actions/cancel-report.jsx:103`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/actions/cancel-report.jsx#L103)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/actions/cancel-report.jsx`
- **Line Number**: `103`
- **Button Label**: `Cancelling... / Cancel Report`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Cancelling... / Cancel Report" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancelling... / Cancel Report</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   102 |         confirmButton={
>  103 |           <Button variant="destructive" disabled={isCancelling}>
   104 |             {isCancelling ? 'Cancelling...' : 'Cancel Report'}
   105 |           </Button>
   106 |         }
```

</details>

---

#### 122. [`src/pages/ASM/reports/components/actions/cancel-report.jsx:107`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/actions/cancel-report.jsx#L107)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/actions/cancel-report.jsx`
- **Line Number**: `107`
- **Button Label**: `Back`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Back" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowLeft className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowLeft className="size-4" />
  <span>Back</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   106 |         }
>  107 |         cancelButton={<Button variant="outline">Back</Button>}
   108 |       />
   109 |     </>
   110 |   );
```

</details>

---

#### 123. [`src/pages/ASM/reports/components/actions/delete-report.jsx:31`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/actions/delete-report.jsx#L31)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/actions/delete-report.jsx`
- **Line Number**: `31`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    30 |       confirmButton={
>   31 |         <Button variant="primary" disabled={isDeleting}>
    32 |           Proceed
    33 |         </Button>
    34 |       }
```

</details>

---

#### 124. [`src/pages/ASM/reports/components/actions/delete-report.jsx:35`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/actions/delete-report.jsx#L35)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/actions/delete-report.jsx`
- **Line Number**: `35`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    34 |       }
>   35 |       cancelButton={<Button variant="outline">Cancel</Button>}
    36 |     >
    37 |       <Trash />
    38 |     </ButtonWithConfirm>
```

</details>

---

#### 125. [`src/pages/ASM/reports/components/lists/asm-report-bulk-update.jsx:49`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/lists/asm-report-bulk-update.jsx#L49)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/lists/asm-report-bulk-update.jsx`
- **Line Number**: `49`
- **Button Label**: `Delete Reports`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete Reports" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete Reports</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    48 |                 onConfirm={handleBulkDelete}
>   49 |                 confirmButton={<Button variant="destructive">Delete Reports</Button>}
    50 |                 cancelButton={<Button variant="outline">Cancel</Button>}
    51 |             >
    52 |                 <div className='flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors'>
```

</details>

---

#### 126. [`src/pages/ASM/reports/components/lists/asm-report-bulk-update.jsx:50`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/lists/asm-report-bulk-update.jsx#L50)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/reports/components/lists/asm-report-bulk-update.jsx`
- **Line Number**: `50`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    49 |                 confirmButton={<Button variant="destructive">Delete Reports</Button>}
>   50 |                 cancelButton={<Button variant="outline">Cancel</Button>}
    51 |             >
    52 |                 <div className='flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors'>
    53 |                     <Trash2 size={16} />
```

</details>

---

#### 127. [`src/pages/ASM/rules/components/create-update-rule.jsx:195`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/create-update-rule.jsx#L195)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/create-update-rule.jsx`
- **Line Number**: `195`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   194 |       <div className="flex items-center justify-end gap-2 mt-2">
>  195 |         {mode !== "create" && <Button
   196 |           variant="outline"
   197 |           onClick={() => {
   198 |             resetAll();
```

</details>

---

#### 128. [`src/pages/ASM/rules/components/modals/show-rules-guidelines.jsx:35`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/modals/show-rules-guidelines.jsx#L35)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/modals/show-rules-guidelines.jsx`
- **Line Number**: `35`
- **Button Label**: `Guide`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Guide" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plug className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plug className="size-4" />
  <span>Guide</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    34 |         ) : (
>   35 |           <Button
    36 |             variant="primary"
    37 |             mode="link"
    38 |             underline="solid"
```

</details>

---

#### 129. [`src/pages/ASM/rules/components/modals/show-rules-guidelines.jsx:47`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/modals/show-rules-guidelines.jsx#L47)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/modals/show-rules-guidelines.jsx`
- **Line Number**: `47`
- **Button Label**: `Close`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Close" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Close</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    46 |         <div className="mt-2 flex justify-end">
>   47 |           <Button onClick={() => setIsModalOpen(false)}>Close</Button>
    48 |         </div>
    49 |       }
    50 |       className="
```

</details>

---

#### 130. [`src/pages/ASM/rules/components/rule-item.jsx:214`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/rule-item.jsx#L214)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/rule-item.jsx`
- **Line Number**: `214`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   213 |                   onConfirm={() => handleDelete(rule._id)}
>  214 |                   confirmButton={<Button variant="primary">Proceed</Button>}
   215 |                   cancelButton={<Button variant="outline">Cancel</Button>}
   216 |                   className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-destructive hover:text-destructive focus:bg-accent focus:text-destructive"
   217 |                 >
```

</details>

---

#### 131. [`src/pages/ASM/rules/components/rule-item.jsx:215`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/rule-item.jsx#L215)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/rule-item.jsx`
- **Line Number**: `215`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   214 |                   confirmButton={<Button variant="primary">Proceed</Button>}
>  215 |                   cancelButton={<Button variant="outline">Cancel</Button>}
   216 |                   className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-destructive hover:text-destructive focus:bg-accent focus:text-destructive"
   217 |                 >
   218 |                   <Trash className="w-4 h-4 mr-2" />
```

</details>

---

#### 132. [`src/pages/ASM/rules/components/rule-table.jsx:237`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/rule-table.jsx#L237)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/rule-table.jsx`
- **Line Number**: `237`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   236 |                     onConfirm={() => handleDelete(row.original._id)}
>  237 |                     confirmButton={<Button variant="primary">Proceed</Button>}
   238 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   239 |                     className="w-full justify-start text-destructive font-normal"
   240 |                   >
```

</details>

---

#### 133. [`src/pages/ASM/rules/components/rule-table.jsx:238`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/rule-table.jsx#L238)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/components/rule-table.jsx`
- **Line Number**: `238`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   237 |                     confirmButton={<Button variant="primary">Proceed</Button>}
>  238 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   239 |                     className="w-full justify-start text-destructive font-normal"
   240 |                   >
   241 |                     Delete
```

</details>

---

#### 134. [`src/pages/ASM/rules/rules.jsx:45`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/rules.jsx#L45)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/rules/rules.jsx`
- **Line Number**: `45`
- **Button Label**: `Explore signal library`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Explore signal library" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Search className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Search className="size-4" />
  <span>Explore signal library</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    44 |             <Link to="/assetinventory/engine/policy/library">
>   45 |               <Button variant="outline">Explore signal library</Button>
    46 |             </Link>
    47 |           </div>
    48 |         }
```

</details>

---

#### 135. [`src/pages/ASM/signal-library/signal-library.jsx:85`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signal-library/signal-library.jsx#L85)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signal-library/signal-library.jsx`
- **Line Number**: `85`
- **Button Label**: `Importing... / Import`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Importing... / Import" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Importing... / Import</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    84 |               confirmButton={
>   85 |                 <Button variant="primary" disabled={isImportingAll}>
    86 |                   {isImportingAll ? 'Importing...' : 'Import'}
    87 |                 </Button>
    88 |               }
```

</details>

---

#### 136. [`src/pages/ASM/signal-library/signal-library.jsx:89`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signal-library/signal-library.jsx#L89)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signal-library/signal-library.jsx`
- **Line Number**: `89`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    88 |               }
>   89 |               cancelButton={<Button variant="outline">Cancel</Button>}
    90 |             >
    91 |               <FolderInput className="size-4 mr-2" />
    92 |               {isImportingAll ? 'Importing...' : 'Import all'}
```

</details>

---

#### 137. [`src/pages/ASM/signals/components/edit-exposure.jsx:61`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/components/edit-exposure.jsx#L61)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/components/edit-exposure.jsx`
- **Line Number**: `61`
- **Button Label**: `Cancel`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    60 |                 <div className="w-full flex items-center gap-2 justify-end">
>   61 |                     <Button variant="destructive" onClick={() => setShowEdit(false)}>
    62 |                         Cancel
    63 |                     </Button>
    64 |                     <Button onClick={handleUpdate}>
```

</details>

---

#### 138. [`src/pages/ASM/signals/components/exposure-row-actions.jsx:43`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/components/exposure-row-actions.jsx#L43)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/components/exposure-row-actions.jsx`
- **Line Number**: `43`
- **Button Label**: `Send to VM`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Send to VM" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Send className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Send className="size-4" />
  <span>Send to VM</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    42 |               }}
>   43 |               confirmButton={<Button variant="primary">Send to VM</Button>}
    44 |               cancelButton={<Button variant="outline">Cancel</Button>}
    45 |               className="w-full justify-start h-8 px-2 font-normal"
    46 |             >
```

</details>

---

#### 139. [`src/pages/ASM/signals/components/exposure-row-actions.jsx:44`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/components/exposure-row-actions.jsx#L44)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/components/exposure-row-actions.jsx`
- **Line Number**: `44`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    43 |               confirmButton={<Button variant="primary">Send to VM</Button>}
>   44 |               cancelButton={<Button variant="outline">Cancel</Button>}
    45 |               className="w-full justify-start h-8 px-2 font-normal"
    46 |             >
    47 |               Send to VM
```

</details>

---

#### 140. [`src/pages/ASM/signals/components/rule-card.jsx:139`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/components/rule-card.jsx#L139)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/components/rule-card.jsx`
- **Line Number**: `139`
- **Button Label**: `Delete`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   138 |                       onConfirm={() => onDelete(rule._id)}
>  139 |                       confirmButton={<Button variant="primary">Delete</Button>}
   140 |                       cancelButton={<Button variant="outline">Cancel</Button>}
   141 |                       className="w-full justify-start h-8 px-2 text-destructive hover:text-destructive font-normal"
   142 |                     >
```

</details>

---

#### 141. [`src/pages/ASM/signals/components/rule-card.jsx:140`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/components/rule-card.jsx#L140)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/components/rule-card.jsx`
- **Line Number**: `140`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   139 |                       confirmButton={<Button variant="primary">Delete</Button>}
>  140 |                       cancelButton={<Button variant="outline">Cancel</Button>}
   141 |                       className="w-full justify-start h-8 px-2 text-destructive hover:text-destructive font-normal"
   142 |                     >
   143 |                       Delete Rule
```

</details>

---

#### 142. [`src/pages/ASM/signals/signals.jsx:119`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/signals.jsx#L119)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/signals.jsx`
- **Line Number**: `119`
- **Button Label**: `Explore signal library`
- **Current Variant**: `secondary`
- **Issue**: **Missing Icon**: The button with label "Explore signal library" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Search className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Search className="size-4" />
  <span>Explore signal library</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   118 |               <Link to="/casm/signal-library">
>  119 |                 <Button variant="secondary">
   120 |                   Explore signal library
   121 |                 </Button>
   122 |               </Link>
```

</details>

---

#### 143. [`src/pages/ASM/signals/signals.jsx:164`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/signals.jsx#L164)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/ASM/signals/signals.jsx`
- **Line Number**: `164`
- **Button Label**: `Explore signal library`
- **Current Variant**: `secondary`
- **Issue**: **Missing Icon**: The button with label "Explore signal library" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Search className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Search className="size-4" />
  <span>Explore signal library</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   163 |                     <Link to="/casm/signal-library">
>  164 |                       <Button variant="secondary">
   165 |                         Explore signal library
   166 |                       </Button>
   167 |                     </Link>
```

</details>

---

### Pages: Agent

#### 144. [`src/pages/Agent/pages/settings/components/data-collection-tab.jsx:287`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Agent/pages/settings/components/data-collection-tab.jsx#L287)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Agent/pages/settings/components/data-collection-tab.jsx`
- **Line Number**: `287`
- **Button Label**: `Discard changes`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Discard changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Discard changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   286 |         <div className="flex items-center justify-end gap-3">
>  287 |           <Button variant="outline" onClick={handleDiscard} disabled={isSaving}>
   288 |             Discard changes
   289 |           </Button>
   290 |           <Button onClick={handleSave} disabled={isSaving}>
```

</details>

---

#### 145. [`src/pages/Agent/pages/settings/components/data-collection-tab.jsx:290`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Agent/pages/settings/components/data-collection-tab.jsx#L290)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Agent/pages/settings/components/data-collection-tab.jsx`
- **Line Number**: `290`
- **Button Label**: `Save collection settings`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save collection settings" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save collection settings</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   289 |           </Button>
>  290 |           <Button onClick={handleSave} disabled={isSaving}>
   291 |             Save collection settings
   292 |           </Button>
   293 |         </div>
```

</details>

---

#### 146. [`src/pages/Agent/pages/settings/components/general-tab.jsx:203`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Agent/pages/settings/components/general-tab.jsx#L203)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Agent/pages/settings/components/general-tab.jsx`
- **Line Number**: `203`
- **Button Label**: `Discard changes`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Discard changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Discard changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   202 |         <div className="flex items-center justify-end gap-3 pb-6">
>  203 |           <Button variant="outline" onClick={handleDiscard} disabled={isSaving}>
   204 |             Discard changes
   205 |           </Button>
   206 |           <Button onClick={handleSave} disabled={isSaving}>
```

</details>

---

#### 147. [`src/pages/Agent/pages/settings/components/general-tab.jsx:206`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Agent/pages/settings/components/general-tab.jsx#L206)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Agent/pages/settings/components/general-tab.jsx`
- **Line Number**: `206`
- **Button Label**: `Save configuration`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save configuration" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save configuration</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   205 |           </Button>
>  206 |           <Button onClick={handleSave} disabled={isSaving}>
   207 |             Save configuration
   208 |           </Button>
   209 |         </div>
```

</details>

---

### Pages: CSM

#### 148. [`src/pages/CSM/pages/dashboard/dashboard-page.jsx:70`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/dashboard/dashboard-page.jsx#L70)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/dashboard/dashboard-page.jsx`
- **Line Number**: `70`
- **Button Label**: `Go to Integrations`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Go to Integrations" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Go to Integrations</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    69 |         subTitle="The dashboard will display information once assets are onboarded and scanned."
>   70 |         engage={<Button onClick={() => navigate('/csp-m/integrations')}>Go to Integrations</Button>}
    71 |       />
    72 |     );
    73 |   }
```

</details>

---

#### 149. [`src/pages/CSM/pages/integrations/components/configure-adapter-modal.jsx:90`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/integrations/components/configure-adapter-modal.jsx#L90)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/integrations/components/configure-adapter-modal.jsx`
- **Line Number**: `90`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    89 |         <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
>   90 |           <Button variant="outline" onClick={handleClose}>Cancel</Button>
    91 |           <Button onClick={handleSave} disabled={isSaving}>Save Changes</Button>
    92 |         </div>
    93 |       }
```

</details>

---

#### 150. [`src/pages/CSM/pages/integrations/components/configure-adapter-modal.jsx:91`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/integrations/components/configure-adapter-modal.jsx#L91)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/integrations/components/configure-adapter-modal.jsx`
- **Line Number**: `91`
- **Button Label**: `Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    90 |           <Button variant="outline" onClick={handleClose}>Cancel</Button>
>   91 |           <Button onClick={handleSave} disabled={isSaving}>Save Changes</Button>
    92 |         </div>
    93 |       }
    94 |     >
```

</details>

---

#### 151. [`src/pages/CSM/pages/projects/components/dropdown-actions.jsx:70`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/projects/components/dropdown-actions.jsx#L70)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/projects/components/dropdown-actions.jsx`
- **Line Number**: `70`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    69 |                             confirmButton={
>   70 |                                 <Button variant="primary" >
    71 |                                     Proceed
    72 |                                 </Button>
    73 |                             }
```

</details>

---

#### 152. [`src/pages/CSM/pages/projects/components/dropdown-actions.jsx:74`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/projects/components/dropdown-actions.jsx#L74)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/projects/components/dropdown-actions.jsx`
- **Line Number**: `74`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    73 |                             }
>   74 |                             cancelButton={<Button variant="outline">Cancel</Button>}>
    75 |                             <Trash2 /> Delete
    76 |                         </ButtonWithConfirm>
    77 |                     </AuthorityGuard>
```

</details>

---

#### 153. [`src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx:68`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx#L68)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx`
- **Line Number**: `68`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    67 |               }}
>   68 |               confirmButton={<Button variant="primary" disabled={isRegenerating}>Proceed</Button>}
    69 |               cancelButton={<Button variant="outline">Cancel</Button>}
    70 |               className="w-full justify-start !font-normal px-2 py-1.5 text-sm h-8"
    71 |             >
```

</details>

---

#### 154. [`src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx:69`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx#L69)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx`
- **Line Number**: `69`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    68 |               confirmButton={<Button variant="primary" disabled={isRegenerating}>Proceed</Button>}
>   69 |               cancelButton={<Button variant="outline">Cancel</Button>}
    70 |               className="w-full justify-start !font-normal px-2 py-1.5 text-sm h-8"
    71 |             >
    72 |               <span>Regenerate</span>
```

</details>

---

#### 155. [`src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx:105`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx#L105)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx`
- **Line Number**: `105`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   104 |                 }}
>  105 |                 confirmButton={<Button variant="destructive" disabled={isDeleting}>Delete</Button>}
   106 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   107 |                 className="w-full justify-start !font-normal hover:bg-red-200/20 px-2 py-1.5 text-sm h-8"
   108 |               >
```

</details>

---

#### 156. [`src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx:106`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx#L106)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/dropdowns/report-list-dropdown.jsx`
- **Line Number**: `106`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   105 |                 confirmButton={<Button variant="destructive" disabled={isDeleting}>Delete</Button>}
>  106 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   107 |                 className="w-full justify-start !font-normal hover:bg-red-200/20 px-2 py-1.5 text-sm h-8"
   108 |               >
   109 |                 <span className="text-destructive">Delete</span>
```

</details>

---

#### 157. [`src/pages/CSM/pages/reports/components/report-bulk-update.jsx:49`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/report-bulk-update.jsx#L49)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/report-bulk-update.jsx`
- **Line Number**: `49`
- **Button Label**: `Delete Reports`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete Reports" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete Reports</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    48 |           onConfirm={handleBulkDelete}
>   49 |           confirmButton={<Button variant="destructive">Delete Reports</Button>}
    50 |           cancelButton={<Button variant="outline">Cancel</Button>}
    51 |           className="hover:bg-red-200/20"
    52 |         >
```

</details>

---

#### 158. [`src/pages/CSM/pages/reports/components/report-bulk-update.jsx:50`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/report-bulk-update.jsx#L50)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/reports/components/report-bulk-update.jsx`
- **Line Number**: `50`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    49 |           confirmButton={<Button variant="destructive">Delete Reports</Button>}
>   50 |           cancelButton={<Button variant="outline">Cancel</Button>}
    51 |           className="hover:bg-red-200/20"
    52 |         >
    53 |           <div className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors">
```

</details>

---

#### 159. [`src/pages/CSM/pages/vulnerabilities/components/actions/bulk-archive.jsx:34`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/actions/bulk-archive.jsx#L34)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/actions/bulk-archive.jsx`
- **Line Number**: `34`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    33 |       onConfirm={handleBulkArchive}
>   34 |       confirmButton={<Button variant="primary">Proceed</Button>}
    35 |       cancelButton={<Button variant="outline">Cancel</Button>}
    36 |     >
    37 |       <Archive size={14} /> Archive
```

</details>

---

#### 160. [`src/pages/CSM/pages/vulnerabilities/components/actions/bulk-archive.jsx:35`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/actions/bulk-archive.jsx#L35)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/actions/bulk-archive.jsx`
- **Line Number**: `35`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    34 |       confirmButton={<Button variant="primary">Proceed</Button>}
>   35 |       cancelButton={<Button variant="outline">Cancel</Button>}
    36 |     >
    37 |       <Archive size={14} /> Archive
    38 |     </ButtonWithConfirm>
```

</details>

---

#### 161. [`src/pages/CSM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx:36`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx#L36)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx`
- **Line Number**: `36`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    35 |       onConfirm={handleRunAnalysis}
>   36 |       confirmButton={<Button variant="primary">Proceed</Button>}
    37 |       cancelButton={<Button variant="outline">Cancel</Button>}
    38 |       dialog="Are you sure you want to run false positive analysis on the selected vulnerabilities?"
    39 |       confirmTitle="False Positive Analysis"
```

</details>

---

#### 162. [`src/pages/CSM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx:37`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx#L37)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx`
- **Line Number**: `37`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    36 |       confirmButton={<Button variant="primary">Proceed</Button>}
>   37 |       cancelButton={<Button variant="outline">Cancel</Button>}
    38 |       dialog="Are you sure you want to run false positive analysis on the selected vulnerabilities?"
    39 |       confirmTitle="False Positive Analysis"
    40 |     >
```

</details>

---

#### 163. [`src/pages/CSM/pages/vulnerabilities/components/bulk-risk-acceptance-form.jsx:110`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/bulk-risk-acceptance-form.jsx#L110)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/bulk-risk-acceptance-form.jsx`
- **Line Number**: `110`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   109 |           <DialogFooter>
>  110 |             <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
   111 |               Cancel
   112 |             </Button>
   113 |             <Button type="submit" variant="outline" disabled={isLoading}>
```

</details>

---

#### 164. [`src/pages/CSM/pages/vulnerabilities/components/modals/create-vulnerability.jsx:75`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/modals/create-vulnerability.jsx#L75)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/CSM/pages/vulnerabilities/components/modals/create-vulnerability.jsx`
- **Line Number**: `75`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    74 |         <div className="flex justify-end gap-2 w-full mt-4">
>   75 |           <Button
    76 |             variant="outline"
    77 |             onClick={() => handleModalClose(false)}
    78 |             disabled={isCreating}
```

</details>

---

### Pages: Home

#### 165. [`src/pages/Home/home2.jsx:321`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Home/home2.jsx#L321)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Home/home2.jsx`
- **Line Number**: `321`
- **Button Label**: `Logout`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Logout" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <LogOut className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <LogOut className="size-4" />
  <span>Logout</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   320 |                     <LogOut className="text-primary" size={15} />
>  321 |                     <Button mode="link" underlined="dashed" onClick={logout}>
   322 |                         Logout
   323 |                     </Button>
   324 |                 </div>
```

</details>

---

#### 166. [`src/pages/Home/home3.jsx:264`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Home/home3.jsx#L264)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/Home/home3.jsx`
- **Line Number**: `264`
- **Button Label**: `Logout`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Logout" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <LogOut className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <LogOut className="size-4" />
  <span>Logout</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   263 |           <LogOut className="text-primary" size={17} />
>  264 |           <Button mode="link" underlined="dashed" onClick={logout}>
   265 |             Logout
   266 |           </Button>
   267 |         </div>
```

</details>

---

### Pages: SAST

#### 167. [`src/pages/SAST/pages/integrations/components/configure-adapter-modal.jsx:65`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SAST/pages/integrations/components/configure-adapter-modal.jsx#L65)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SAST/pages/integrations/components/configure-adapter-modal.jsx`
- **Line Number**: `65`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    64 |         <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
>   65 |           <Button variant="outline" onClick={handleClose} disabled={isInstalling}>
    66 |             Cancel
    67 |           </Button>
    68 |           <Button onClick={handleSave} disabled={isInstalling || !apiKey.trim()}>
```

</details>

---

#### 168. [`src/pages/SAST/pages/project-detail/components/project-detail-dashboard.jsx:261`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SAST/pages/project-detail/components/project-detail-dashboard.jsx#L261)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SAST/pages/project-detail/components/project-detail-dashboard.jsx`
- **Line Number**: `261`
- **Button Label**: `View All Vulnerabilities`
- **Current Variant**: `link`
- **Issue**: **Missing Icon**: The button with label "View All Vulnerabilities" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>View All Vulnerabilities</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   260 |         <CardFooter className="justify-center py-3 border-t border-border/50">
>  261 |           <Button
   262 |             variant="link"
   263 |             onClick={() => setActiveTab('vulnerabilities')}
   264 |             className="text-xs font-medium text-blue-500 hover:underline"
```

</details>

---

#### 169. [`src/pages/SAST/pages/project-detail/project-detail.jsx:230`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SAST/pages/project-detail/project-detail.jsx#L230)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SAST/pages/project-detail/project-detail.jsx`
- **Line Number**: `230`
- **Button Label**: `Back to Projects`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Back to Projects" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowLeft className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowLeft className="size-4" />
  <span>Back to Projects</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   229 |           actionButton={
>  230 |             <Button variant="outline" onClick={() => navigate('/ui-sast/projects')}>
   231 |               Back to Projects
   232 |             </Button>
   233 |           }
```

</details>

---

#### 170. [`src/pages/SAST/pages/projects/components/import-repo-modal.jsx:90`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SAST/pages/projects/components/import-repo-modal.jsx#L90)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SAST/pages/projects/components/import-repo-modal.jsx`
- **Line Number**: `90`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    89 |         <DialogFooter>
>   90 |           <Button variant="outline" onClick={() => onOpenChange(false)}>
    91 |             Cancel
    92 |           </Button>
    93 |           <Button variant="primary" onClick={onSubmit} disabled={isImporting}>
```

</details>

---

#### 171. [`src/pages/SAST/pages/scans/components/create-sca-scan-modal.jsx:74`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SAST/pages/scans/components/create-sca-scan-modal.jsx#L74)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SAST/pages/scans/components/create-sca-scan-modal.jsx`
- **Line Number**: `74`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    73 |         <div className="flex items-center justify-end gap-2">
>   74 |           <Button variant="outline" onClick={() => setIsOpen(false)}>
    75 |             Cancel
    76 |           </Button>
    77 |           <Button onClick={handleScan} disabled={isScanning}>
```

</details>

---

### Pages: SCA

#### 172. [`src/pages/SCA/pages/action-plan/components/actions/refresh-plan.jsx:36`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/action-plan/components/actions/refresh-plan.jsx#L36)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/action-plan/components/actions/refresh-plan.jsx`
- **Line Number**: `36`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    35 |       confirmVariant="info"
>   36 |       confirmButton={<Button variant="primary">Proceed</Button>}
    37 |       cancelButton={<Button variant="outline">Cancel</Button>}
    38 |       onConfirm={handleRefresh}
    39 |       {...props}
```

</details>

---

#### 173. [`src/pages/SCA/pages/action-plan/components/actions/refresh-plan.jsx:37`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/action-plan/components/actions/refresh-plan.jsx#L37)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/action-plan/components/actions/refresh-plan.jsx`
- **Line Number**: `37`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    36 |       confirmButton={<Button variant="primary">Proceed</Button>}
>   37 |       cancelButton={<Button variant="outline">Cancel</Button>}
    38 |       onConfirm={handleRefresh}
    39 |       {...props}
    40 |     >
```

</details>

---

#### 174. [`src/pages/SCA/pages/container-images/components/add-image-modal.jsx:64`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/container-images/components/add-image-modal.jsx#L64)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/container-images/components/add-image-modal.jsx`
- **Line Number**: `64`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    63 |         <div className="flex items-center justify-end gap-2">
>   64 |           <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
    65 |             Cancel
    66 |           </Button>
    67 |           <Button variant="primary" onClick={handleAddImageSubmit} disabled={isImporting}>
```

</details>

---

#### 175. [`src/pages/SCA/pages/dependencies/components/actions/reindex-manifests.jsx:39`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/dependencies/components/actions/reindex-manifests.jsx#L39)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/dependencies/components/actions/reindex-manifests.jsx`
- **Line Number**: `39`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    38 |       confirmVariant="info"
>   39 |       confirmButton={<Button variant="primary">Proceed</Button>}
    40 |       cancelButton={<Button variant="outline">Cancel</Button>}
    41 |       onConfirm={handleReindex}
    42 |       {...props}
```

</details>

---

#### 176. [`src/pages/SCA/pages/dependencies/components/actions/reindex-manifests.jsx:40`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/dependencies/components/actions/reindex-manifests.jsx#L40)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/dependencies/components/actions/reindex-manifests.jsx`
- **Line Number**: `40`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    39 |       confirmButton={<Button variant="primary">Proceed</Button>}
>   40 |       cancelButton={<Button variant="outline">Cancel</Button>}
    41 |       onConfirm={handleReindex}
    42 |       {...props}
    43 |     >
```

</details>

---

#### 177. [`src/pages/SCA/pages/integrations/components/adapter-modals/github.jsx:165`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/integrations/components/adapter-modals/github.jsx#L165)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/integrations/components/adapter-modals/github.jsx`
- **Line Number**: `165`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   164 |           <div className="flex items-center justify-between w-full">
>  165 |             <Button variant="outline" onClick={handleClose}>
   166 |               Cancel
   167 |             </Button>
   168 |             <Button
```

</details>

---

#### 178. [`src/pages/SCA/pages/integrations/components/adapter-modals/github.jsx:294`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/integrations/components/adapter-modals/github.jsx#L294)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/integrations/components/adapter-modals/github.jsx`
- **Line Number**: `294`
- **Button Label**: `Change Token`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Change Token" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Change Token</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   293 |                 </div>
>  294 |                 <Button
   295 |                   variant="ghost"
   296 |                   size="sm"
   297 |                   className="text-xs h-7 text-muted-foreground hover:text-foreground"
```

</details>

---

#### 179. [`src/pages/SCA/pages/integrations/components/configure-adapter-modal.jsx:51`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/integrations/components/configure-adapter-modal.jsx#L51)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/integrations/components/configure-adapter-modal.jsx`
- **Line Number**: `51`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    50 |         <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
>   51 |           <Button variant="outline" onClick={handleClose}>Cancel</Button>
    52 |           <Button onClick={handleClose}>Save Changes</Button>
    53 |         </div>
    54 |       }
```

</details>

---

#### 180. [`src/pages/SCA/pages/integrations/components/configure-adapter-modal.jsx:52`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/integrations/components/configure-adapter-modal.jsx#L52)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/integrations/components/configure-adapter-modal.jsx`
- **Line Number**: `52`
- **Button Label**: `Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    51 |           <Button variant="outline" onClick={handleClose}>Cancel</Button>
>   52 |           <Button onClick={handleClose}>Save Changes</Button>
    53 |         </div>
    54 |       }
    55 |     >
```

</details>

---

#### 181. [`src/pages/SCA/pages/projects/components/import-repo-modal.jsx:90`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/projects/components/import-repo-modal.jsx#L90)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/projects/components/import-repo-modal.jsx`
- **Line Number**: `90`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    89 |         <DialogFooter>
>   90 |           <Button variant="outline" onClick={() => onOpenChange(false)}>
    91 |             Cancel
    92 |           </Button>
    93 |           <Button variant="primary" onClick={onSubmit} disabled={isImporting}>
```

</details>

---

#### 182. [`src/pages/SCA/pages/projects/components/project-detail-dashboard.jsx:261`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/projects/components/project-detail-dashboard.jsx#L261)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/projects/components/project-detail-dashboard.jsx`
- **Line Number**: `261`
- **Button Label**: `View All Vulnerabilities`
- **Current Variant**: `link`
- **Issue**: **Missing Icon**: The button with label "View All Vulnerabilities" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>View All Vulnerabilities</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   260 |         <CardFooter className="justify-center py-3 border-t border-border/50">
>  261 |           <Button
   262 |             variant="link"
   263 |             onClick={() => setActiveTab('vulnerabilities')}
   264 |             className="text-xs font-medium text-blue-500 hover:underline"
```

</details>

---

#### 183. [`src/pages/SCA/pages/projects/project-detail.jsx:232`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/projects/project-detail.jsx#L232)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/projects/project-detail.jsx`
- **Line Number**: `232`
- **Button Label**: `Back to Projects`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Back to Projects" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowLeft className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowLeft className="size-4" />
  <span>Back to Projects</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   231 |           actionButton={
>  232 |             <Button variant="outline" onClick={() => navigate('/sca/projects')}>
   233 |               Back to Projects
   234 |             </Button>
   235 |           }
```

</details>

---

#### 184. [`src/pages/SCA/pages/reports/components/card-integration.jsx:86`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/reports/components/card-integration.jsx#L86)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/reports/components/card-integration.jsx`
- **Line Number**: `86`
- **Button Label**: `PDF View`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "PDF View" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>PDF View</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    85 |         {type === 'executive' && (
>   86 |           <Button
    87 |             variant="outline"
    88 |             onClick={() => window.open('/sca-reports/executive', '_blank')}
    89 |           >
```

</details>

---

#### 185. [`src/pages/SCA/pages/scans/components/create-sca-scan-modal.jsx:124`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/scans/components/create-sca-scan-modal.jsx#L124)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/SCA/pages/scans/components/create-sca-scan-modal.jsx`
- **Line Number**: `124`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   123 |         <div className="flex items-center justify-end gap-2">
>  124 |           <Button variant="outline" onClick={() => setIsOpen(false)}>
   125 |             Cancel
   126 |           </Button>
   127 |           <Button onClick={handleScan} disabled={isScanning}>
```

</details>

---

### Pages: VM

#### 186. [`src/pages/VM/pages/asseessment-edit/components/actions/delete-evidence.jsx:30`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/actions/delete-evidence.jsx#L30)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/actions/delete-evidence.jsx`
- **Line Number**: `30`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    29 |         onConfirm={() => handleDelete()}
>   30 |         confirmButton={<Button variant="destructive">Delete</Button>}
    31 |         cancelButton={<Button variant="outline">Cancel</Button>}
    32 |         className="hover:bg-red-200/20"
    33 |       >
```

</details>

---

#### 187. [`src/pages/VM/pages/asseessment-edit/components/actions/delete-evidence.jsx:31`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/actions/delete-evidence.jsx#L31)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/actions/delete-evidence.jsx`
- **Line Number**: `31`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    30 |         confirmButton={<Button variant="destructive">Delete</Button>}
>   31 |         cancelButton={<Button variant="outline">Cancel</Button>}
    32 |         className="hover:bg-red-200/20"
    33 |       >
    34 |         <Trash2 size={10} className="text-destructive" />
```

</details>

---

#### 188. [`src/pages/VM/pages/asseessment-edit/components/basic-details.jsx:678`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-details.jsx#L678)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-details.jsx`
- **Line Number**: `678`
- **Button Label**: `Leave`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Leave" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <LogOut className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <LogOut className="size-4" />
  <span>Leave</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   677 |         onConfirm={handleLeaveProject}
>  678 |         confirmButton={<Button variant="destructive">Leave</Button>}
   679 |         dialog="Are you sure you want to leave this project? On leaving you will lose access to all tickets in this assessment."
   680 |       />
   681 |       <ConfirmDialog
```

</details>

---

#### 189. [`src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx:224`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx#L224)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx`
- **Line Number**: `224`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save field") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   223 |                       <div className="flex items-center justify-center gap-1">
>  224 |                         <Button
   225 |                           variant="ghost"
   226 |                           mode="icon"
   227 |                           disabled={form.formState.isSubmitting}
```

</details>

---

#### 190. [`src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx:284`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx#L284)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx`
- **Line Number**: `284`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save field") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   283 |                       <div className="flex items-center justify-center gap-1">
>  284 |                         <Button
   285 |                           variant="ghost"
   286 |                           mode="icon"
   287 |                           onClick={() => handleSaveField('date')}
```

</details>

---

#### 191. [`src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx:341`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx#L341)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx`
- **Line Number**: `341`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save field") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   340 |                       <div className="flex items-center justify-center gap-1">
>  341 |                         <Button
   342 |                           variant="ghost"
   343 |                           mode="icon"
   344 |                           onClick={() => handleSaveField('category')}
```

</details>

---

#### 192. [`src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx:397`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx#L397)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx`
- **Line Number**: `397`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save field") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   396 |                       <div className="flex items-center justify-center gap-1">
>  397 |                         <Button
   398 |                           variant="ghost"
   399 |                           mode="icon"
   400 |                           onClick={() => handleSaveField('scopeString')}
```

</details>

---

#### 193. [`src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx:466`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx#L466)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx`
- **Line Number**: `466`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save field") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   465 |                       <div className="flex items-center justify-center gap-1">
>  466 |                         <Button
   467 |                           variant="ghost"
   468 |                           mode="icon"
   469 |                           onClick={() => handleSaveField('defaultTicketOwner')}
```

</details>

---

#### 194. [`src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx:561`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx#L561)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx`
- **Line Number**: `561`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save field") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   560 |                       <div className="flex items-center gap-1">
>  561 |                         <Button
   562 |                           onClick={() => handleSaveField('departmentId')}
   563 |                           variant="ghost"
   564 |                           mode="icon"
```

</details>

---

#### 195. [`src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx:635`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx#L635)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx`
- **Line Number**: `635`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   634 |                           confirmOnInput={assessment?.title || 'CONFIRM'}
>  635 |                           confirmButton={<Button variant="primary">Proceed</Button>}
   636 |                           cancelButton={<Button variant="outline">Cancel</Button>}
   637 |                           onConfirm={() => handleSaveField('businessUnitIds')}
   638 |                         >
```

</details>

---

#### 196. [`src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx:636`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx#L636)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx`
- **Line Number**: `636`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   635 |                           confirmButton={<Button variant="primary">Proceed</Button>}
>  636 |                           cancelButton={<Button variant="outline">Cancel</Button>}
   637 |                           onConfirm={() => handleSaveField('businessUnitIds')}
   638 |                         >
   639 |                           <Check size={16} className="text-blue-500" />
```

</details>

---

#### 197. [`src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx:695`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx#L695)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx`
- **Line Number**: `695`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save field") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   694 |                       <div className="flex items-center gap-1">
>  695 |                         <Button
   696 |                           onClick={() => handleSaveField('vendorId')}
   697 |                           variant="ghost"
   698 |                           mode="icon"
```

</details>

---

#### 198. [`src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx:755`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx#L755)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/basic-edit.jsx`
- **Line Number**: `755`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save field") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   754 |                       <div className="flex items-center gap-1">
>  755 |                         <Button
   756 |                           onClick={() => handleSaveField('vulnSource')}
   757 |                           variant="ghost"
   758 |                           mode="icon"
```

</details>

---

#### 199. [`src/pages/VM/pages/asseessment-edit/components/collabrators.jsx:145`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/collabrators.jsx#L145)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/collabrators.jsx`
- **Line Number**: `145`
- **Button Label**: `Add`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Add" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <UserPlus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <UserPlus className="size-4" />
  <span>Add</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   144 | 
>  145 |             <Button
   146 |               disabled={isAddingCollabrator}
   147 |               className="rounded-l-none border-l-0"
   148 |               onClick={handleAddCollaborator}
```

</details>

---

#### 200. [`src/pages/VM/pages/asseessment-edit/components/stop-pause-assessment.jsx:84`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/stop-pause-assessment.jsx#L84)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/components/stop-pause-assessment.jsx`
- **Line Number**: `84`
- **Button Label**: `Resume`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Resume" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Resume</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    83 |         isFinished(assessment.state) ? (
>   84 |           <Button disabled variant="outline">
    85 |             Resume
    86 |           </Button>
    87 |         ) : !isPaused(assessment.state) ? (
```

</details>

---

#### 201. [`src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx:179`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx#L179)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx`
- **Line Number**: `179`
- **Button Label**: `Execute`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Execute" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Execute</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   178 |                 onConfirm={() => handleExecute(row.original._id)}
>  179 |                 confirmButton={<Button variant="primary">Execute</Button>}
   180 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   181 |                 className="w-full justify-start h-8 px-2 text-xs font-normal cursor-pointer flex items-center"
   182 |               >
```

</details>

---

#### 202. [`src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx:180`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx#L180)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx`
- **Line Number**: `180`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   179 |                 confirmButton={<Button variant="primary">Execute</Button>}
>  180 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   181 |                 className="w-full justify-start h-8 px-2 text-xs font-normal cursor-pointer flex items-center"
   182 |               >
   183 |                 Execute Now
```

</details>

---

#### 203. [`src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx:206`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx#L206)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx`
- **Line Number**: `206`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   205 |                   onConfirm={() => handleDelete(row.original._id)}
>  206 |                   confirmButton={<Button variant="destructive">Delete</Button>}
   207 |                   cancelButton={<Button variant="outline">Cancel</Button>}
   208 |                   className="w-full justify-start h-8 px-2 text-xs text-destructive hover:text-destructive font-normal cursor-pointer flex items-center"
   209 |                 >
```

</details>

---

#### 204. [`src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx:207`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx#L207)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx`
- **Line Number**: `207`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   206 |                   confirmButton={<Button variant="destructive">Delete</Button>}
>  207 |                   cancelButton={<Button variant="outline">Cancel</Button>}
   208 |                   className="w-full justify-start h-8 px-2 text-xs text-destructive hover:text-destructive font-normal cursor-pointer flex items-center"
   209 |                 >
   210 |                   Delete Rule
```

</details>

---

#### 205. [`src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx:314`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx#L314)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx`
- **Line Number**: `314`
- **Button Label**: `Confirm`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Confirm" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Confirm</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   313 |         confirmButton={
>  314 |           <Button variant="primary">
   315 |             Confirm
   316 |           </Button>
   317 |         }
```

</details>

---

#### 206. [`src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx:318`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx#L318)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/automation-tab.jsx`
- **Line Number**: `318`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   317 |         }
>  318 |         cancelButton={<Button variant="outline">Cancel</Button>}
   319 |       />
   320 |       <RuleDetailsDrawer
   321 |         rule={selectedRule}
```

</details>

---

#### 207. [`src/pages/VM/pages/asseessment-edit/tabs/change-info/components/test-crendiantials-model.jsx:14`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/change-info/components/test-crendiantials-model.jsx#L14)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/change-info/components/test-crendiantials-model.jsx`
- **Line Number**: `14`
- **Button Label**: `View Credentials`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "View Credentials" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>View Credentials</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    13 |       trigger={
>   14 |         <Button className="text-xs" mode="link">
    15 |             View Credentials
    16 |         </Button>       
    17 |       }
```

</details>

---

#### 208. [`src/pages/VM/pages/asseessment-edit/tabs/evidences-tab.jsx:112`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/evidences-tab.jsx#L112)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/evidences-tab.jsx`
- **Line Number**: `112`
- **Button Label**: `Upload File`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Upload File" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Upload File</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   111 |             </Button>
>  112 |             <Button disabled>Upload File</Button>
   113 |           </div>
   114 |         </div>
   115 | 
```

</details>

---

#### 209. [`src/pages/VM/pages/asseessment-edit/tabs/reason-model.jsx:25`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/reason-model.jsx#L25)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/reason-model.jsx`
- **Line Number**: `25`
- **Button Label**: `Pause`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Pause" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pause className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pause className="size-4" />
  <span>Pause</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    24 |             description="Please provide a reason for pausing the assessment."
>   25 |             trigger={<Button variant="outline" onClick={() => setIsOpen(true)}>Pause</Button>}
    26 |             footer={
    27 |                 <Button 
    28 |                     variant="outline" 
```

</details>

---

#### 210. [`src/pages/VM/pages/asseessment-edit/tabs/reason-model.jsx:27`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/reason-model.jsx#L27)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/reason-model.jsx`
- **Line Number**: `27`
- **Button Label**: `Pause`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Pause" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pause className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pause className="size-4" />
  <span>Pause</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    26 |             footer={
>   27 |                 <Button 
    28 |                     variant="outline" 
    29 |                     onClick={handleSubmit}
    30 |                     disabled={!reason.trim()}
```

</details>

---

#### 211. [`src/pages/VM/pages/asseessment-edit/tabs/scope.jsx:508`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/scope.jsx#L508)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/asseessment-edit/tabs/scope.jsx`
- **Line Number**: `508`
- **Button Label**: `Download`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Download" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Download className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Download className="size-4" />
  <span>Download</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   507 |                   </div>
>  508 |                   <Button
   509 |                     variant="outline"
   510 |                     size="sm"
   511 |                     className="h-8"
```

</details>

---

#### 212. [`src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx:108`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx#L108)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx`
- **Line Number**: `108`
- **Button Label**: `Disable / Enable`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Disable / Enable" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Power className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Power className="size-4" />
  <span>Disable / Enable</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   107 |                     confirmButton={
>  108 |                       <Button variant="primary">
   109 |                         {rule.enabled ? 'Disable' : 'Enable'}
   110 |                       </Button>
   111 |                     }
```

</details>

---

#### 213. [`src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx:112`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx#L112)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx`
- **Line Number**: `112`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   111 |                     }
>  112 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   113 |                     className="w-full justify-start h-8 px-2 text-sm font-normal"
   114 |                   >
   115 |                     {rule.enabled ? 'Disable' : 'Enable'}
```

</details>

---

#### 214. [`src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx:124`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx#L124)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx`
- **Line Number**: `124`
- **Button Label**: `Execute`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Execute" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Execute</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   123 |                     onConfirm={() => onExecute(rule._id)}
>  124 |                     confirmButton={<Button variant="primary">Execute</Button>}
   125 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   126 |                     className="w-full justify-start h-8 px-2 text-sm font-normal hover:pointer-cursor"
   127 |                   >
```

</details>

---

#### 215. [`src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx:125`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx#L125)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx`
- **Line Number**: `125`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   124 |                     confirmButton={<Button variant="primary">Execute</Button>}
>  125 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   126 |                     className="w-full justify-start h-8 px-2 text-sm font-normal hover:pointer-cursor"
   127 |                   >
   128 |                     Execute Now
```

</details>

---

#### 216. [`src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx:146`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx#L146)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx`
- **Line Number**: `146`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   145 |                       onConfirm={() => onDelete(rule._id)}
>  146 |                       confirmButton={<Button variant="destructive">Delete</Button>}
   147 |                       cancelButton={<Button variant="outline">Cancel</Button>}
   148 |                       className="w-full justify-start hover:cursor-pointer h-8 px-2 text-destructive hover:text-destructive font-normal"
   149 |                     >
```

</details>

---

#### 217. [`src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx:147`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx#L147)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/automation-sidebar.jsx`
- **Line Number**: `147`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   146 |                       confirmButton={<Button variant="destructive">Delete</Button>}
>  147 |                       cancelButton={<Button variant="outline">Cancel</Button>}
   148 |                       className="w-full justify-start hover:cursor-pointer h-8 px-2 text-destructive hover:text-destructive font-normal"
   149 |                     >
   150 |                       Delete
```

</details>

---

#### 218. [`src/pages/VM/pages/automation-engine/components/create-automation-rule-modal.jsx:255`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/create-automation-rule-modal.jsx#L255)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/create-automation-rule-modal.jsx`
- **Line Number**: `255`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   254 |       <div className="flex justify-end mt-6 gap-2">
>  255 |         <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
   256 |         <Button
   257 |           variant="outline"
   258 |           onClick={handleSaveRule}
```

</details>

---

#### 219. [`src/pages/VM/pages/automation-engine/components/details-header.jsx:48`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/details-header.jsx#L48)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/details-header.jsx`
- **Line Number**: `48`
- **Button Label**: `Execute`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Execute" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Execute</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    47 |             onConfirm={() => onExecute(activeRule._id)}
>   48 |             confirmButton={<Button variant="primary">Execute</Button>}
    49 |             cancelButton={<Button variant="outline">Cancel</Button>}
    50 |             className="w-full justify-start h-8 px-2 font-normal"
    51 |           >
```

</details>

---

#### 220. [`src/pages/VM/pages/automation-engine/components/details-header.jsx:49`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/details-header.jsx#L49)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/details-header.jsx`
- **Line Number**: `49`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    48 |             confirmButton={<Button variant="primary">Execute</Button>}
>   49 |             cancelButton={<Button variant="outline">Cancel</Button>}
    50 |             className="w-full justify-start h-8 px-2 font-normal"
    51 |           >
    52 |             {isExecuting ? (
```

</details>

---

#### 221. [`src/pages/VM/pages/automation-engine/components/edit-automation-rule-modal.jsx:284`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/edit-automation-rule-modal.jsx#L284)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/edit-automation-rule-modal.jsx`
- **Line Number**: `284`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   283 |       <div className="flex justify-end mt-6 gap-2">
>  284 |         <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
   285 |         <Button
   286 |           variant="outline"
   287 |           onClick={handleSave}
```

</details>

---

#### 222. [`src/pages/VM/pages/automation-engine/components/jobs-tab.jsx:82`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/jobs-tab.jsx#L82)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/jobs-tab.jsx`
- **Line Number**: `82`
- **Button Label**: `Cancel`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    81 |               confirmButton={
>   82 |                 <Button variant="destructive" disabled={isCanceling}>
    83 |                   Cancel
    84 |                 </Button>
    85 |               }
```

</details>

---

#### 223. [`src/pages/VM/pages/automation-engine/components/jobs-tab.jsx:86`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/jobs-tab.jsx#L86)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/jobs-tab.jsx`
- **Line Number**: `86`
- **Button Label**: `Back`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Back" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowLeft className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowLeft className="size-4" />
  <span>Back</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    85 |               }
>   86 |               cancelButton={<Button variant="outline">Back</Button>}
    87 |               className="w-full justify-start font-normal text-destructive hover:bg-red-50 hover:text-destructive dark:hover:bg-red-950/50 focus:bg-red-50 focus:text-destructive dark:focus:bg-red-950/50 px-2 py-1.5 text-sm h-8 cursor-pointer"
    88 |             >
    89 |               <span>Cancel</span>
```

</details>

---

#### 224. [`src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx:23`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx#L23)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx`
- **Line Number**: `23`
- **Button Label**: `{op}`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "{op}" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>{op}</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    22 |       {['AND', 'OR', 'NOT']?.map((op) => (
>   23 |         <Button
    24 |           key={op}
    25 |           variant={value === op ? 'primary' : 'ghost'}
    26 |           size="sm"
```

</details>

---

#### 225. [`src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx:252`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx#L252)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx`
- **Line Number**: `252`
- **Button Label**: `Add Condition`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add Condition") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   251 |         <div className="flex items-center gap-2">
>  252 |           <Button variant="ghost" size="sm" onClick={addRule} className="h-7 text-xs hover:bg-primary/10 hover:text-primary">
   253 |             <Plus className="size-3 mr-1.5" />
   254 |             Add Condition
   255 |           </Button>
```

</details>

---

#### 226. [`src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx:257`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx#L257)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx`
- **Line Number**: `257`
- **Button Label**: `Add Group`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add Group") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   256 |           {depth < 3 && (
>  257 |             <Button variant="ghost" size="sm" onClick={addGroup} className="h-7 text-xs hover:bg-primary/10 hover:text-primary">
   258 |               <Plus className="size-3 mr-1.5" />
   259 |               Add Group
   260 |             </Button>
```

</details>

---

#### 227. [`src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx:263`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx#L263)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/tabs/automation-condition-tab.jsx`
- **Line Number**: `263`
- **Button Label**: `Remove`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Remove" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Remove</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   262 |           {!isOnly && (
>  263 |             <Button variant="ghost" size="sm" onClick={onRemove} className="h-7 text-xs text-destructive hover:bg-destructive/10">
   264 |               Remove
   265 |             </Button>
   266 |           )}
```

</details>

---

#### 228. [`src/pages/VM/pages/automation-engine/components/tabs/automation-policy-tab.jsx:150`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/tabs/automation-policy-tab.jsx#L150)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/automation-engine/components/tabs/automation-policy-tab.jsx`
- **Line Number**: `150`
- **Button Label**: `{freq}`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "{freq}" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <KeyRound className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <KeyRound className="size-4" />
  <span>{freq}</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   149 |               return (
>  150 |                 <Button
   151 |                   key={freq}
   152 |                   variant={active ? 'default' : 'outline'}
   153 |                   className="flex-1 capitalize py-2 h-9"
```

</details>

---

#### 229. [`src/pages/VM/pages/business-unit-details/components/actions/delete-business-unit.jsx:45`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/business-unit-details/components/actions/delete-business-unit.jsx#L45)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/business-unit-details/components/actions/delete-business-unit.jsx`
- **Line Number**: `45`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    44 |         confirmButton={
>   45 |           <Button variant="destructive" disabled={isDeleting}>
    46 |             Delete
    47 |           </Button>
    48 |         }
```

</details>

---

#### 230. [`src/pages/VM/pages/business-unit-details/components/actions/delete-business-unit.jsx:49`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/business-unit-details/components/actions/delete-business-unit.jsx#L49)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/business-unit-details/components/actions/delete-business-unit.jsx`
- **Line Number**: `49`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    48 |         }
>   49 |         cancelButton={<Button variant="outline">Cancel</Button>}
    50 |       >
    51 |         <Trash2 />
    52 |       </ButtonWithConfirm>
```

</details>

---

#### 231. [`src/pages/VM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx:34`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx#L34)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx`
- **Line Number**: `34`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    33 |         onConfirm={handleRemove}
>   34 |         confirmButton={<Button variant="primary">Proceed</Button>}
    35 |         cancelButton={<Button variant="outline">Cancel</Button>}
    36 |         className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    37 |         {...props}
```

</details>

---

#### 232. [`src/pages/VM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx:35`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx#L35)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/business-unit-details/components/actions/remove-business-units-associated-asset.jsx`
- **Line Number**: `35`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    34 |         confirmButton={<Button variant="primary">Proceed</Button>}
>   35 |         cancelButton={<Button variant="outline">Cancel</Button>}
    36 |         className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    37 |         {...props}
    38 |       >
```

</details>

---

#### 233. [`src/pages/VM/pages/business-units/components/modals/edit-business-unit-modal.jsx:191`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/business-units/components/modals/edit-business-unit-modal.jsx#L191)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/business-units/components/modals/edit-business-unit-modal.jsx`
- **Line Number**: `191`
- **Button Label**: `Updating... / Update Business Unit`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Updating... / Update Business Unit" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Updating... / Update Business Unit</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   190 |           <div className="flex justify-end pt-2">
>  191 |             <Button onClick={handleUpdate} disabled={isLoading}>
   192 |               {isLoading ? 'Updating...' : 'Update Business Unit'}
   193 |             </Button>
   194 |           </div>
```

</details>

---

#### 234. [`src/pages/VM/pages/dashboard/components/Charts/VulnerabilityDistribution.jsx:90`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/dashboard/components/Charts/VulnerabilityDistribution.jsx#L90)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/dashboard/components/Charts/VulnerabilityDistribution.jsx`
- **Line Number**: `90`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    89 |         <DialogFooter>
>   90 |           <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
    91 |           <Button
    92 |             type="button"
    93 |             onClick={handleDownload}
```

</details>

---

#### 235. [`src/pages/VM/pages/dashboard/components/Charts/VulnerabilityDistribution.jsx:91`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/dashboard/components/Charts/VulnerabilityDistribution.jsx#L91)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/dashboard/components/Charts/VulnerabilityDistribution.jsx`
- **Line Number**: `91`
- **Button Label**: `Downloading... / Download Report`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Downloading... / Download Report" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Downloading... / Download Report</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    90 |           <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
>   91 |           <Button
    92 |             type="button"
    93 |             onClick={handleDownload}
    94 |             disabled={isDownloading || !startDate || !endDate}
```

</details>

---

#### 236. [`src/pages/VM/pages/dashboard/components/custom-dashboard/update-dashboard.jsx:154`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/dashboard/components/custom-dashboard/update-dashboard.jsx#L154)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/dashboard/components/custom-dashboard/update-dashboard.jsx`
- **Line Number**: `154`
- **Button Label**: `Delete Dashboard`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete Dashboard" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete Dashboard</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   153 |             confirm={true}
>  154 |             confirmButton={<Button variant="destructive">Delete Dashboard</Button>}
   155 |           >
   156 |             <Trash2 />
   157 |           </ButtonWithConfirm>
```

</details>

---

#### 237. [`src/pages/VM/pages/folders/components/actions/delete-folder-btn.jsx:33`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/actions/delete-folder-btn.jsx#L33)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/actions/delete-folder-btn.jsx`
- **Line Number**: `33`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    32 |         onConfirm={() => handleDeleteFolder()}
>   33 |         confirmButton={<Button variant="destructive">Delete</Button>}
    34 |         cancelButton={<Button variant="outline">Cancel</Button>}
    35 |       >
    36 |         <span className=" font-normal w-full text-destructive">Delete</span>
```

</details>

---

#### 238. [`src/pages/VM/pages/folders/components/actions/delete-folder-btn.jsx:34`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/actions/delete-folder-btn.jsx#L34)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/actions/delete-folder-btn.jsx`
- **Line Number**: `34`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    33 |         confirmButton={<Button variant="destructive">Delete</Button>}
>   34 |         cancelButton={<Button variant="outline">Cancel</Button>}
    35 |       >
    36 |         <span className=" font-normal w-full text-destructive">Delete</span>
    37 |       </ButtonWithConfirm>
```

</details>

---

#### 239. [`src/pages/VM/pages/folders/components/modals/add-assessments.jsx:96`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/add-assessments.jsx#L96)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/add-assessments.jsx`
- **Line Number**: `96`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    95 |         <div className="flex gap-2 justify-end mt-4">
>   96 |           <Button
    97 |             variant="outline"
    98 |             onClick={handleModalClose}
    99 |             disabled={isLoading}
```

</details>

---

#### 240. [`src/pages/VM/pages/folders/components/modals/add-assessments.jsx:103`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/add-assessments.jsx#L103)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/add-assessments.jsx`
- **Line Number**: `103`
- **Button Label**: `Adding... / Add Assessments`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Adding... / Add Assessments" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Adding... / Add Assessments</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   102 |           </Button>
>  103 |           <Button
   104 |             variant="primary"
   105 |             onClick={handleSubmit}
   106 |             disabled={isLoading || !selectedAssessments.length}
```

</details>

---

#### 241. [`src/pages/VM/pages/folders/components/modals/create-child-model.jsx:80`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/create-child-model.jsx#L80)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/create-child-model.jsx`
- **Line Number**: `80`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    79 |         <div className="flex gap-2 justify-end mt-4">
>   80 |           <Button
    81 |             variant="outline"
    82 |             onClick={handleModalClose}
    83 |             disabled={isLoading}
```

</details>

---

#### 242. [`src/pages/VM/pages/folders/components/modals/create-child-model.jsx:87`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/create-child-model.jsx#L87)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/create-child-model.jsx`
- **Line Number**: `87`
- **Button Label**: `Creating... / Create Folder`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Creating... / Create Folder" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Creating... / Create Folder</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    86 |           </Button>
>   87 |           <Button
    88 |             variant="primary"
    89 |             onClick={form.handleSubmit(handleSubmit)}
    90 |             disabled={isLoading || !form.formState.isValid}
```

</details>

---

#### 243. [`src/pages/VM/pages/folders/components/modals/create-model.jsx:93`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/create-model.jsx#L93)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/create-model.jsx`
- **Line Number**: `93`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    92 |         <div className="flex gap-2 justify-end mt-4">
>   93 |           <Button
    94 |             variant="outline"
    95 |             onClick={handleModalClose}
    96 |             disabled={isLoading}
```

</details>

---

#### 244. [`src/pages/VM/pages/folders/components/modals/edit-model.jsx:111`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/edit-model.jsx#L111)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/edit-model.jsx`
- **Line Number**: `111`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   110 |         <div className="flex gap-2 justify-end mt-4">
>  111 |           <Button 
   112 |             variant="outline" 
   113 |             onClick={handleModalClose}
   114 |             disabled={isLoading}
```

</details>

---

#### 245. [`src/pages/VM/pages/folders/components/modals/edit-model.jsx:118`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/edit-model.jsx#L118)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/folders/components/modals/edit-model.jsx`
- **Line Number**: `118`
- **Button Label**: `Updating... / Update Folder`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Updating... / Update Folder" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Updating... / Update Folder</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   117 |           </Button>
>  118 |           <Button 
   119 |             variant="primary" 
   120 |             onClick={form.handleSubmit(handleSubmit)}
   121 |             disabled={isLoading || !form.formState.isValid}
```

</details>

---

#### 246. [`src/pages/VM/pages/integration/components/configure-adapter-modal.jsx:79`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/integration/components/configure-adapter-modal.jsx#L79)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/integration/components/configure-adapter-modal.jsx`
- **Line Number**: `79`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    78 |         <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
>   79 |           <Button variant="outline" onClick={handleClose}>Cancel</Button>
    80 |           <Button onClick={handleSave} disabled={isSaving}>Save Changes</Button>
    81 |         </div>
    82 |       }
```

</details>

---

#### 247. [`src/pages/VM/pages/integration/components/configure-adapter-modal.jsx:80`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/integration/components/configure-adapter-modal.jsx#L80)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/integration/components/configure-adapter-modal.jsx`
- **Line Number**: `80`
- **Button Label**: `Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    79 |           <Button variant="outline" onClick={handleClose}>Cancel</Button>
>   80 |           <Button onClick={handleSave} disabled={isSaving}>Save Changes</Button>
    81 |         </div>
    82 |       }
    83 |     >
```

</details>

---

#### 248. [`src/pages/VM/pages/normalization/components/create-rule-model.jsx:237`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/create-rule-model.jsx#L237)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/create-rule-model.jsx`
- **Line Number**: `237`
- **Button Label**: `Cancel`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   236 |       <div className='flex justify-end mt-6'>
>  237 |         <Button variant="ghost" className='mr-2' onClick={() => setOpen(false)}>Cancel</Button>
   238 |         <Button
   239 |           variant="outline"
   240 |           onClick={handleSaveRule}
```

</details>

---

#### 249. [`src/pages/VM/pages/normalization/components/normalization-sidebar.jsx:79`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx#L79)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx`
- **Line Number**: `79`
- **Button Label**: `Disable / Enable`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Disable / Enable" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Power className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Power className="size-4" />
  <span>Disable / Enable</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    78 |                     confirmButton={
>   79 |                       <Button variant="primary">
    80 |                         {rule.enabled ? 'Disable' : 'Enable'}
    81 |                       </Button>
    82 |                     }
```

</details>

---

#### 250. [`src/pages/VM/pages/normalization/components/normalization-sidebar.jsx:83`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx#L83)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx`
- **Line Number**: `83`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    82 |                     }
>   83 |                     cancelButton={<Button variant="outline">Cancel</Button>}
    84 |                     className="w-full justify-start h-8 px-2 text-sm font-normal"
    85 |                   >
    86 |                     {rule.enabled ? 'Disable' : 'Enable'}
```

</details>

---

#### 251. [`src/pages/VM/pages/normalization/components/normalization-sidebar.jsx:95`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx#L95)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx`
- **Line Number**: `95`
- **Button Label**: `Execute Now`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Execute Now" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Execute Now</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    94 |                     confirmButton={
>   95 |                       <Button variant="primary">Execute Now</Button>
    96 |                     }
    97 |                     cancelButton={<Button variant="outline">Cancel</Button>}
    98 |                     className="w-full justify-start h-8 px-2 text-sm font-normal"
```

</details>

---

#### 252. [`src/pages/VM/pages/normalization/components/normalization-sidebar.jsx:97`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx#L97)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx`
- **Line Number**: `97`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    96 |                     }
>   97 |                     cancelButton={<Button variant="outline">Cancel</Button>}
    98 |                     className="w-full justify-start h-8 px-2 text-sm font-normal"
    99 |                   >
   100 |                     Execute Now
```

</details>

---

#### 253. [`src/pages/VM/pages/normalization/components/normalization-sidebar.jsx:111`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx#L111)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx`
- **Line Number**: `111`
- **Button Label**: `Delete`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   110 |                       onConfirm={() => onDelete(rule._id)}
>  111 |                       confirmButton={<Button variant="primary">Delete</Button>}
   112 |                       cancelButton={<Button variant="outline">Cancel</Button>}
   113 |                       className="w-full justify-start h-8 px-2 text-destructive hover:text-destructive font-normal"
   114 |                     >
```

</details>

---

#### 254. [`src/pages/VM/pages/normalization/components/normalization-sidebar.jsx:112`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx#L112)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/normalization/components/normalization-sidebar.jsx`
- **Line Number**: `112`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   111 |                       confirmButton={<Button variant="primary">Delete</Button>}
>  112 |                       cancelButton={<Button variant="outline">Cancel</Button>}
   113 |                       className="w-full justify-start h-8 px-2 text-destructive hover:text-destructive font-normal"
   114 |                     >
   115 |                       Delete
```

</details>

---

#### 255. [`src/pages/VM/pages/relevance-group-details/components/modals/rule-details-drawer.jsx:285`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/modals/rule-details-drawer.jsx#L285)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/modals/rule-details-drawer.jsx`
- **Line Number**: `285`
- **Button Label**: `Execute`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Execute" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Execute</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   284 |                           onConfirm={() => handleExecuteRule(activeRule._id)}
>  285 |                           confirmButton={<Button variant="primary">Execute</Button>}
   286 |                           cancelButton={<Button variant="outline">Cancel</Button>}
   287 |                           className="w-full justify-start h-8 px-2 font-normal"
   288 |                         >
```

</details>

---

#### 256. [`src/pages/VM/pages/relevance-group-details/components/modals/rule-details-drawer.jsx:286`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/modals/rule-details-drawer.jsx#L286)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/modals/rule-details-drawer.jsx`
- **Line Number**: `286`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   285 |                           confirmButton={<Button variant="primary">Execute</Button>}
>  286 |                           cancelButton={<Button variant="outline">Cancel</Button>}
   287 |                           className="w-full justify-start h-8 px-2 font-normal"
   288 |                         >
   289 |                           {isExecuting ? (
```

</details>

---

#### 257. [`src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx:187`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx#L187)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx`
- **Line Number**: `187`
- **Button Label**: `Execute`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Execute" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Execute</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   186 |                 onConfirm={() => handleExecute(row.original._id)}
>  187 |                 confirmButton={<Button variant="primary">Execute</Button>}
   188 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   189 |                 className="w-full justify-start h-8 px-2 text-xs font-normal cursor-pointer flex items-center"
   190 |               >
```

</details>

---

#### 258. [`src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx:188`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx#L188)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx`
- **Line Number**: `188`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   187 |                 confirmButton={<Button variant="primary">Execute</Button>}
>  188 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   189 |                 className="w-full justify-start h-8 px-2 text-xs font-normal cursor-pointer flex items-center"
   190 |               >
   191 |                 Execute Now
```

</details>

---

#### 259. [`src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx:214`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx#L214)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx`
- **Line Number**: `214`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   213 |                   onConfirm={() => handleDelete(row.original._id)}
>  214 |                   confirmButton={<Button variant="destructive">Delete</Button>}
   215 |                   cancelButton={<Button variant="outline">Cancel</Button>}
   216 |                   className="w-full justify-start h-8 px-2 text-xs text-destructive hover:text-destructive font-normal cursor-pointer flex items-center"
   217 |                 >
```

</details>

---

#### 260. [`src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx:215`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx#L215)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx`
- **Line Number**: `215`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   214 |                   confirmButton={<Button variant="destructive">Delete</Button>}
>  215 |                   cancelButton={<Button variant="outline">Cancel</Button>}
   216 |                   className="w-full justify-start h-8 px-2 text-xs text-destructive hover:text-destructive font-normal cursor-pointer flex items-center"
   217 |                 >
   218 |                   Delete Rule
```

</details>

---

#### 261. [`src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx:312`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx#L312)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx`
- **Line Number**: `312`
- **Button Label**: `Confirm`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Confirm" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Confirm</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   311 |         confirmButton={
>  312 |           <Button variant="primary">
   313 |             Confirm
   314 |           </Button>
   315 |         }
```

</details>

---

#### 262. [`src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx:316`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx#L316)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/relevance-group-details/components/tabs/ActionsTab.jsx`
- **Line Number**: `316`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   315 |         }
>  316 |         cancelButton={<Button variant="outline">Cancel</Button>}
   317 |       />
   318 |       <RuleDetailsDrawer
   319 |         rule={selectedRule}
```

</details>

---

#### 263. [`src/pages/VM/pages/remidation-campaign-details/components/actions/delete-remediation-campaign.jsx:41`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/delete-remediation-campaign.jsx#L41)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/delete-remediation-campaign.jsx`
- **Line Number**: `41`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    40 |         dialog="Are you sure you want to delete this remediation campaign? This action is permanent and cannot be undone."
>   41 |         confirmButton={<Button variant="destructive">Delete</Button>}
    42 |         cancelButton={<Button variant="outline">Cancel</Button>}
    43 |         className={iconOnly ? 'text-destructive hover:bg-red-200/20' : 'flex hover:bg-red-200/20'}
    44 |         {...props}
```

</details>

---

#### 264. [`src/pages/VM/pages/remidation-campaign-details/components/actions/delete-remediation-campaign.jsx:42`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/delete-remediation-campaign.jsx#L42)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/delete-remediation-campaign.jsx`
- **Line Number**: `42`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    41 |         confirmButton={<Button variant="destructive">Delete</Button>}
>   42 |         cancelButton={<Button variant="outline">Cancel</Button>}
    43 |         className={iconOnly ? 'text-destructive hover:bg-red-200/20' : 'flex hover:bg-red-200/20'}
    44 |         {...props}
    45 |       >
```

</details>

---

#### 265. [`src/pages/VM/pages/remidation-campaign-details/components/actions/export-campaign-action-plan.jsx:49`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/export-campaign-action-plan.jsx#L49)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/export-campaign-action-plan.jsx`
- **Line Number**: `49`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    48 |           dialog="This will generate and download the action plan for this remediation campaign. Proceed?"
>   49 |           confirmButton={<Button variant="primary">Proceed</Button>}
    50 |           cancelButton={<Button variant="outline">Cancel</Button>}
    51 |           className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    52 |           {...props}
```

</details>

---

#### 266. [`src/pages/VM/pages/remidation-campaign-details/components/actions/export-campaign-action-plan.jsx:50`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/export-campaign-action-plan.jsx#L50)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/export-campaign-action-plan.jsx`
- **Line Number**: `50`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    49 |           confirmButton={<Button variant="primary">Proceed</Button>}
>   50 |           cancelButton={<Button variant="outline">Cancel</Button>}
    51 |           className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    52 |           {...props}
    53 |         >
```

</details>

---

#### 267. [`src/pages/VM/pages/remidation-campaign-details/components/actions/recompute-remidation-campaign.jsx:37`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/recompute-remidation-campaign.jsx#L37)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/recompute-remidation-campaign.jsx`
- **Line Number**: `37`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    36 |           dialog="This will trigger a recomputation of the vulnerability states and assets for this remediation campaign. Proceed?"
>   37 |           confirmButton={<Button variant="primary">Proceed</Button>}
    38 |           cancelButton={<Button variant="outline">Cancel</Button>}
    39 |           className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    40 |           {...props}
```

</details>

---

#### 268. [`src/pages/VM/pages/remidation-campaign-details/components/actions/recompute-remidation-campaign.jsx:38`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/recompute-remidation-campaign.jsx#L38)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/recompute-remidation-campaign.jsx`
- **Line Number**: `38`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    37 |           confirmButton={<Button variant="primary">Proceed</Button>}
>   38 |           cancelButton={<Button variant="outline">Cancel</Button>}
    39 |           className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    40 |           {...props}
    41 |         >
```

</details>

---

#### 269. [`src/pages/VM/pages/remidation-campaign-details/components/actions/send-remidation-campaign-to-jira.jsx:64`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/send-remidation-campaign-to-jira.jsx#L64)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/send-remidation-campaign-to-jira.jsx`
- **Line Number**: `64`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    63 |           dialog="This will send the remediation campaign to Jira. Proceed?"
>   64 |           confirmButton={<Button variant="primary">Proceed</Button>}
    65 |           cancelButton={<Button variant="outline">Cancel</Button>}
    66 |           className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    67 |           {...props}
```

</details>

---

#### 270. [`src/pages/VM/pages/remidation-campaign-details/components/actions/send-remidation-campaign-to-jira.jsx:65`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/send-remidation-campaign-to-jira.jsx#L65)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/actions/send-remidation-campaign-to-jira.jsx`
- **Line Number**: `65`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    64 |           confirmButton={<Button variant="primary">Proceed</Button>}
>   65 |           cancelButton={<Button variant="outline">Cancel</Button>}
    66 |           className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    67 |           {...props}
    68 |         >
```

</details>

---

#### 271. [`src/pages/VM/pages/remidation-campaign-details/components/modals/risk-acceptance-campaign-modal.jsx:167`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/modals/risk-acceptance-campaign-modal.jsx#L167)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaign-details/components/modals/risk-acceptance-campaign-modal.jsx`
- **Line Number**: `167`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   166 |             <DialogFooter>
>  167 |               <Button
   168 |                 type="button"
   169 |                 variant="outline"
   170 |                 onClick={() => setOpen(false)}
```

</details>

---

#### 272. [`src/pages/VM/pages/remidation-campaigns/components/actions/recompute-remidation-campaigns.jsx:28`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaigns/components/actions/recompute-remidation-campaigns.jsx#L28)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaigns/components/actions/recompute-remidation-campaigns.jsx`
- **Line Number**: `28`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    27 |         onConfirm={() => handleRecompute()}
>   28 |         confirmButton={<Button variant="primary">Proceed</Button>}
    29 |         cancelButton={<Button variant="outline">Cancel</Button>}
    30 |         className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    31 |         {...props}
```

</details>

---

#### 273. [`src/pages/VM/pages/remidation-campaigns/components/actions/recompute-remidation-campaigns.jsx:29`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaigns/components/actions/recompute-remidation-campaigns.jsx#L29)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/remidation-campaigns/components/actions/recompute-remidation-campaigns.jsx`
- **Line Number**: `29`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    28 |         confirmButton={<Button variant="primary">Proceed</Button>}
>   29 |         cancelButton={<Button variant="outline">Cancel</Button>}
    30 |         className={iconOnly ? 'text-secondary-foreground' : 'flex'}
    31 |         {...props}
    32 |       >
```

</details>

---

#### 274. [`src/pages/VM/pages/report/components/actions/delete-report.jsx:36`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/actions/delete-report.jsx#L36)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/actions/delete-report.jsx`
- **Line Number**: `36`
- **Button Label**: `Proceed`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    35 |       confirmButton={
>   36 |         <Button variant="destructive" disabled={isDeleting}>
    37 |           Proceed
    38 |         </Button>
    39 |       }
```

</details>

---

#### 275. [`src/pages/VM/pages/report/components/actions/delete-report.jsx:40`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/actions/delete-report.jsx#L40)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/actions/delete-report.jsx`
- **Line Number**: `40`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    39 |       }
>   40 |       cancelButton={<Button variant="outline">Cancel</Button>}
    41 |     >
    42 |       <Trash />
    43 |     </ButtonWithConfirm>
```

</details>

---

#### 276. [`src/pages/VM/pages/report/components/actions/re-generate-report.jsx:39`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/actions/re-generate-report.jsx#L39)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/actions/re-generate-report.jsx`
- **Line Number**: `39`
- **Button Label**: `Proceed`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    38 |         confirmButton={
>   39 |           <Button variant="destructive" disabled={isRegenerating}>
    40 |             Proceed
    41 |           </Button>
    42 |         }
```

</details>

---

#### 277. [`src/pages/VM/pages/report/components/actions/re-generate-report.jsx:43`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/actions/re-generate-report.jsx#L43)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/actions/re-generate-report.jsx`
- **Line Number**: `43`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    42 |         }
>   43 |         cancelButton={<Button variant="outline">Cancel</Button>}
    44 |       >
    45 |         <RefreshCcw className="h-4 w-4" />
    46 |       </ButtonWithConfirm>
```

</details>

---

#### 278. [`src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx:70`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx#L70)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx`
- **Line Number**: `70`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    69 |               confirmButton={
>   70 |                 <Button variant="primary" disabled={isRegenerating}>
    71 |                   Proceed
    72 |                 </Button>
    73 |               }
```

</details>

---

#### 279. [`src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx:74`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx#L74)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx`
- **Line Number**: `74`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    73 |               }
>   74 |               cancelButton={<Button variant="outline">Cancel</Button>}
    75 |               className="w-full justify-start !font-normal !hover:bg-transparent !bg-transparent !text-inherit px-2 py-1.5 text-sm h-8"
    76 |             >
    77 |               <span>Regenerate</span>
```

</details>

---

#### 280. [`src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx:112`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx#L112)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx`
- **Line Number**: `112`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   111 |                 confirmButton={
>  112 |                   <Button variant="destructive" disabled={isDeleting}>
   113 |                     Delete
   114 |                   </Button>
   115 |                 }
```

</details>

---

#### 281. [`src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx:116`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx#L116)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/dropdowns/report-list-dropdown.jsx`
- **Line Number**: `116`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   115 |                 }
>  116 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   117 |                 className="w-full justify-start !font-normal hover:bg-red-200/20 px-2 py-1.5 text-sm h-8"
   118 |               >
   119 |                 <span className="text-destructive">Delete</span>
```

</details>

---

#### 282. [`src/pages/VM/pages/report/components/modals/generate-report-modal2.jsx:125`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/modals/generate-report-modal2.jsx#L125)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/modals/generate-report-modal2.jsx`
- **Line Number**: `125`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   124 |         <div className="flex items-center justify-end gap-2">
>  125 |           <Button
   126 |             variant="outline"
   127 |             onClick={() => {
   128 |               setIsModalOpen(false);
```

</details>

---

#### 283. [`src/pages/VM/pages/report/components/report-bulk-update.jsx:52`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/report-bulk-update.jsx#L52)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/report-bulk-update.jsx`
- **Line Number**: `52`
- **Button Label**: `Delete Reports`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete Reports" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete Reports</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    51 |           onConfirm={handleBulkDelete}
>   52 |           confirmButton={<Button variant="destructive">Delete Reports</Button>}
    53 |           cancelButton={<Button variant="outline">Cancel</Button>}
    54 |           className=" hover:bg-red-200/20"
    55 |         >
```

</details>

---

#### 284. [`src/pages/VM/pages/report/components/report-bulk-update.jsx:53`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/report-bulk-update.jsx#L53)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/report/components/report-bulk-update.jsx`
- **Line Number**: `53`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    52 |           confirmButton={<Button variant="destructive">Delete Reports</Button>}
>   53 |           cancelButton={<Button variant="outline">Cancel</Button>}
    54 |           className=" hover:bg-red-200/20"
    55 |         >
    56 |           <div className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors">
```

</details>

---

#### 285. [`src/pages/VM/pages/risk-acceptance/components/actions/risk-acceptance.jsx:103`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/risk-acceptance/components/actions/risk-acceptance.jsx#L103)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/risk-acceptance/components/actions/risk-acceptance.jsx`
- **Line Number**: `103`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   102 |         <div className=" flex gap-2">
>  103 |           <Button variant="outline" onClick={() => setIsOpen(false)}>
   104 |             Cancel
   105 |           </Button>
   106 | 
```

</details>

---

#### 286. [`src/pages/VM/pages/risk-acceptance/components/actions/risk-acceptance.jsx:107`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/risk-acceptance/components/actions/risk-acceptance.jsx#L107)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/risk-acceptance/components/actions/risk-acceptance.jsx`
- **Line Number**: `107`
- **Button Label**: `Commit approval / rejection`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Commit approval / rejection" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Commit approval / rejection</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   106 | 
>  107 |           <Button
   108 |             variant="outline"
   109 |             onClick={handleUpdateRiskAcceptanceStatus}
   110 |             disabled={!reason.trim() || isUpdatingRiskAcceptanceStatus}
```

</details>

---

#### 287. [`src/pages/VM/pages/sla/components/ui/actions-cell.jsx:140`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/components/ui/actions-cell.jsx#L140)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/components/ui/actions-cell.jsx`
- **Line Number**: `140`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   139 |           <div className="flex justify-end gap-3">
>  140 |             <Button
   141 |               variant="outline"
   142 |               onClick={() => setIsChangeOwnerOpen(false)}
   143 |             >
```

</details>

---

#### 288. [`src/pages/VM/pages/sla/components/ui/actions-cell.jsx:146`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/components/ui/actions-cell.jsx#L146)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/components/ui/actions-cell.jsx`
- **Line Number**: `146`
- **Button Label**: `Update Owner`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Update Owner" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Update Owner</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   145 |             </Button>
>  146 |             <Button onClick={handleActions.changeOwner}>Update Owner</Button>
   147 |           </div>
   148 |         }
   149 |         description={
```

</details>

---

#### 289. [`src/pages/VM/pages/sla/pages/dashboard.jsx:105`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/dashboard.jsx#L105)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/dashboard.jsx`
- **Line Number**: `105`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   104 |               confirmButton={
>  105 |                 <Button variant="primary" disabled={isRefreshing}>
   106 |                   Proceed
   107 |                 </Button>
   108 |               }
```

</details>

---

#### 290. [`src/pages/VM/pages/sla/pages/dashboard.jsx:109`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/dashboard.jsx#L109)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/dashboard.jsx`
- **Line Number**: `109`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   108 |               }
>  109 |               cancelButton={<Button variant="outline">Cancel</Button>}
   110 |             >
   111 |               {isRefreshing ? (
   112 |                 <>
```

</details>

---

#### 291. [`src/pages/VM/pages/sla/pages/dashboard.jsx:133`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/dashboard.jsx#L133)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/dashboard.jsx`
- **Line Number**: `133`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Download className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Download className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   132 |               confirmButton={
>  133 |                 <Button variant="primary" disabled={isExporting}>
   134 |                   Proceed
   135 |                 </Button>
   136 |               }
```

</details>

---

#### 292. [`src/pages/VM/pages/sla/pages/dashboard.jsx:137`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/dashboard.jsx#L137)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/dashboard.jsx`
- **Line Number**: `137`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   136 |               }
>  137 |               cancelButton={<Button variant="outline">Cancel</Button>}
   138 |             >
   139 |               {isExporting ? (
   140 |                 <>
```

</details>

---

#### 293. [`src/pages/VM/pages/sla/pages/report.jsx:324`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/report.jsx#L324)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/report.jsx`
- **Line Number**: `324`
- **Button Label**: `Send`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Send" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Send className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Send className="size-4" />
  <span>Send</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   323 |             confirmButton={
>  324 |               <Button variant="primary" disabled={sending}>
   325 |                 Send
   326 |               </Button>
   327 |             }
```

</details>

---

#### 294. [`src/pages/VM/pages/sla/pages/report.jsx:328`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/report.jsx#L328)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/report.jsx`
- **Line Number**: `328`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   327 |             }
>  328 |             cancelButton={<Button variant="outline">Cancel</Button>}
   329 |           >
   330 |             {sending ? 'Sending...' : 'Send Test Email'}
   331 |           </ButtonWithConfirm>
```

</details>

---

#### 295. [`src/pages/VM/pages/sla/pages/settings.jsx:315`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/settings.jsx#L315)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/settings.jsx`
- **Line Number**: `315`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   314 |             confirmButton={
>  315 |               <Button variant="primary" disabled={isCreating}>
   316 |                 Proceed
   317 |               </Button>
   318 |             }
```

</details>

---

#### 296. [`src/pages/VM/pages/sla/pages/settings.jsx:319`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/settings.jsx#L319)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/settings.jsx`
- **Line Number**: `319`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   318 |             }
>  319 |             cancelButton={<Button variant="outline">Cancel</Button>}
   320 |           >
   321 |             <Save /> {isCreating ? 'Saving...' : 'Save SLA Configuration'}
   322 |           </ButtonWithConfirm>
```

</details>

---

#### 297. [`src/pages/VM/pages/sla/pages/violation.jsx:121`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/violation.jsx#L121)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/violation.jsx`
- **Line Number**: `121`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Download className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Download className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   120 |               confirmButton={
>  121 |                 <Button variant="primary" disabled={isExporting}>
   122 |                   Proceed
   123 |                 </Button>
   124 |               }
```

</details>

---

#### 298. [`src/pages/VM/pages/sla/pages/violation.jsx:125`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/violation.jsx#L125)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/sla/pages/violation.jsx`
- **Line Number**: `125`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   124 |               }
>  125 |               cancelButton={<Button variant="outline">Cancel</Button>}
   126 |             >
   127 |               <div className="flex items-center gap-2">
   128 |                 <Download size={16} /> Download CSV
```

</details>

---

#### 299. [`src/pages/VM/pages/vendors/components/DeleteVendorDialog.jsx:29`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vendors/components/DeleteVendorDialog.jsx#L29)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vendors/components/DeleteVendorDialog.jsx`
- **Line Number**: `29`
- **Button Label**: `Delete Service Vendor`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete Service Vendor" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete Service Vendor</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    28 |       confirmButton={
>   29 |         <Button variant="destructive" size="md">
    30 |           Delete Service Vendor
    31 |         </Button>
    32 |       }
```

</details>

---

#### 300. [`src/pages/VM/pages/vendors/components/VendorDetailDialog.jsx:36`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vendors/components/VendorDetailDialog.jsx#L36)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vendors/components/VendorDetailDialog.jsx`
- **Line Number**: `36`
- **Button Label**: `Close`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Close" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Close</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    35 |       footer={
>   36 |         <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
    37 |           Close
    38 |         </Button>
    39 |       }
```

</details>

---

#### 301. [`src/pages/VM/pages/vendors/components/VendorFormDialog.jsx:87`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vendors/components/VendorFormDialog.jsx#L87)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vendors/components/VendorFormDialog.jsx`
- **Line Number**: `87`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    86 |         <div className="flex gap-3 justify-end w-full">
>   87 |           <Button variant="outline" size="md" onClick={() => setOpen(false)}>
    88 |             Cancel
    89 |           </Button>
    90 |           <Button
```

</details>

---

#### 302. [`src/pages/VM/pages/vendors/components/VendorFormDialog.jsx:90`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vendors/components/VendorFormDialog.jsx#L90)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vendors/components/VendorFormDialog.jsx`
- **Line Number**: `90`
- **Button Label**: `Save Changes / Add Service Vendor`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes / Add Service Vendor" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes / Add Service Vendor</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    89 |           </Button>
>   90 |           <Button
    91 |             variant="primary"
    92 |             size="md"
    93 |             onClick={form.handleSubmit(onSubmit)}
```

</details>

---

#### 303. [`src/pages/VM/pages/vulnerabilities/components/actions/bulk-archive.jsx:34`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/actions/bulk-archive.jsx#L34)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/actions/bulk-archive.jsx`
- **Line Number**: `34`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    33 |       onConfirm={handleBulkArchive}
>   34 |       confirmButton={<Button variant="primary">Proceed</Button>}
    35 |       cancelButton={<Button variant="outline">Cancel</Button>}
    36 |     >
    37 |       <Archive size={14} /> Archive
```

</details>

---

#### 304. [`src/pages/VM/pages/vulnerabilities/components/actions/bulk-archive.jsx:35`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/actions/bulk-archive.jsx#L35)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/actions/bulk-archive.jsx`
- **Line Number**: `35`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    34 |       confirmButton={<Button variant="primary">Proceed</Button>}
>   35 |       cancelButton={<Button variant="outline">Cancel</Button>}
    36 |     >
    37 |       <Archive size={14} /> Archive
    38 |     </ButtonWithConfirm>
```

</details>

---

#### 305. [`src/pages/VM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx:36`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx#L36)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx`
- **Line Number**: `36`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    35 |       onConfirm={handleRunAnalysis}
>   36 |       confirmButton={<Button variant="primary">Proceed</Button>}
    37 |       cancelButton={<Button variant="outline">Cancel</Button>}
    38 |       dialog="Are you sure you want to run false positive analysis on the selected vulnerabilities?"
    39 |       confirmTitle="False Positive Analysis"
```

</details>

---

#### 306. [`src/pages/VM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx:37`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx#L37)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/actions/false-positive-analysis.jsx`
- **Line Number**: `37`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    36 |       confirmButton={<Button variant="primary">Proceed</Button>}
>   37 |       cancelButton={<Button variant="outline">Cancel</Button>}
    38 |       dialog="Are you sure you want to run false positive analysis on the selected vulnerabilities?"
    39 |       confirmTitle="False Positive Analysis"
    40 |     >
```

</details>

---

#### 307. [`src/pages/VM/pages/vulnerabilities/components/bulk-risk-acceptance-form.jsx:110`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/bulk-risk-acceptance-form.jsx#L110)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/bulk-risk-acceptance-form.jsx`
- **Line Number**: `110`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   109 |           <DialogFooter>
>  110 |             <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
   111 |               Cancel
   112 |             </Button>
   113 |             <Button type="submit" variant="outline" disabled={isLoading}>
```

</details>

---

#### 308. [`src/pages/VM/pages/vulnerabilities/components/modals/create-vulnerability.jsx:75`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/modals/create-vulnerability.jsx#L75)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerabilities/components/modals/create-vulnerability.jsx`
- **Line Number**: `75`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    74 |         <div className="flex justify-end gap-2 w-full mt-4">
>   75 |           <Button
    76 |             variant="outline"
    77 |             onClick={() => handleModalClose(false)}
    78 |             disabled={isCreating}
```

</details>

---

#### 309. [`src/pages/VM/pages/vulnerability-groups/components/cards/dropdown.jsx:77`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-groups/components/cards/dropdown.jsx#L77)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-groups/components/cards/dropdown.jsx`
- **Line Number**: `77`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    76 |                 }}
>   77 |                 confirmButton={<Button variant="primary">Proceed</Button>}
    78 |                 cancelButton={<Button variant="outline">Cancel</Button>}
    79 |                 className="w-full justify-start "
    80 |               >
```

</details>

---

#### 310. [`src/pages/VM/pages/vulnerability-groups/components/cards/dropdown.jsx:78`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-groups/components/cards/dropdown.jsx#L78)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-groups/components/cards/dropdown.jsx`
- **Line Number**: `78`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    77 |                 confirmButton={<Button variant="primary">Proceed</Button>}
>   78 |                 cancelButton={<Button variant="outline">Cancel</Button>}
    79 |                 className="w-full justify-start "
    80 |               >
    81 |                 {option.icon}
```

</details>

---

#### 311. [`src/pages/VM/pages/vulnerability-groups/components/dropdowns/vuln-list-info-card-dropdown.jsx:116`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-groups/components/dropdowns/vuln-list-info-card-dropdown.jsx#L116)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-groups/components/dropdowns/vuln-list-info-card-dropdown.jsx`
- **Line Number**: `116`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   115 |                   }}
>  116 |                   confirmButton={<Button variant="destructive">Delete</Button>}
   117 |                   cancelButton={<Button variant="outline">Cancel</Button>}
   118 |                   className="w-full justify-start text-red-500 hover:!text-red-600 focus:!text-red-600 hover:!bg-red-500/15 focus:!bg-red-500/15 data-[highlighted]:!bg-red-500/15 cursor-pointer"
   119 |                 >
```

</details>

---

#### 312. [`src/pages/VM/pages/vulnerability-groups/components/dropdowns/vuln-list-info-card-dropdown.jsx:117`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-groups/components/dropdowns/vuln-list-info-card-dropdown.jsx#L117)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-groups/components/dropdowns/vuln-list-info-card-dropdown.jsx`
- **Line Number**: `117`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   116 |                   confirmButton={<Button variant="destructive">Delete</Button>}
>  117 |                   cancelButton={<Button variant="outline">Cancel</Button>}
   118 |                   className="w-full justify-start text-red-500 hover:!text-red-600 focus:!text-red-600 hover:!bg-red-500/15 focus:!bg-red-500/15 data-[highlighted]:!bg-red-500/15 cursor-pointer"
   119 |                 >
   120 |                   {/* {option.icon} */}
```

</details>

---

#### 313. [`src/pages/VM/pages/vulnerability-groups/components/modals/post-vuln-list-modal.jsx:121`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-groups/components/modals/post-vuln-list-modal.jsx#L121)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-groups/components/modals/post-vuln-list-modal.jsx`
- **Line Number**: `121`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   120 |         <div className="flex justify-end gap-2 w-full mt-4">
>  121 |           <Button
   122 |             variant="outline"
   123 |             onClick={() => handleModalClose(false)}
   124 |             disabled={isLoading}
```

</details>

---

#### 314. [`src/pages/VM/pages/vulnerability-report/components/actions/delete-vuln-report-attachment.jsx:31`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/actions/delete-vuln-report-attachment.jsx#L31)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/actions/delete-vuln-report-attachment.jsx`
- **Line Number**: `31`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    30 |       confirmButton={
>   31 |         <Button variant="destructive" disabled={isDeleting}>
    32 |           Delete
    33 |         </Button>
    34 |       }
```

</details>

---

#### 315. [`src/pages/VM/pages/vulnerability-report/components/actions/delete-vuln-report-attachment.jsx:35`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/actions/delete-vuln-report-attachment.jsx#L35)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/actions/delete-vuln-report-attachment.jsx`
- **Line Number**: `35`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    34 |       }
>   35 |       cancelButton={<Button variant="outline">Cancel</Button>}
    36 |       className="hover:bg-red-200/20"
    37 |     >
    38 |       <Trash className='text-red-500'/>
```

</details>

---

#### 316. [`src/pages/VM/pages/vulnerability-report/components/activities/comment.jsx:146`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/activities/comment.jsx#L146)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/activities/comment.jsx`
- **Line Number**: `146`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   145 |                   confirmButton={
>  146 |                     <Button variant="destructive">Delete</Button>
   147 |                   }
   148 |                   cancelButton={
   149 |                     <Button variant="outline">Cancel</Button>
```

</details>

---

#### 317. [`src/pages/VM/pages/vulnerability-report/components/activities/comment.jsx:149`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/activities/comment.jsx#L149)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/activities/comment.jsx`
- **Line Number**: `149`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   148 |                   cancelButton={
>  149 |                     <Button variant="outline">Cancel</Button>
   150 |                   }
   151 |                   className="h-8 w-8 p-0 hover:bg-red-200/20"
   152 |                 >
```

</details>

---

#### 318. [`src/pages/VM/pages/vulnerability-report/components/ask-ai.jsx:165`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/ask-ai.jsx#L165)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/ask-ai.jsx`
- **Line Number**: `165`
- **Button Label**: `Clear`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Clear" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RotateCcw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RotateCcw className="size-4" />
  <span>Clear</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   164 |         <div className="flex items-center gap-3">
>  165 |           <Button
   166 |             variant="ghost"
   167 |             size="sm"
   168 |             onClick={handleClearChat}
```

</details>

---

#### 319. [`src/pages/VM/pages/vulnerability-report/components/options.jsx:61`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx#L61)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx`
- **Line Number**: `61`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    60 |             confirmButton={
>   61 |               <Button variant="primary" disabled={isDeleting}>
    62 |                 Proceed
    63 |               </Button>
    64 |             }
```

</details>

---

#### 320. [`src/pages/VM/pages/vulnerability-report/components/options.jsx:65`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx#L65)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx`
- **Line Number**: `65`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    64 |             }
>   65 |             cancelButton={<Button variant="outline">Cancel</Button>}
    66 |           >
    67 |             <Archive size={14} />
    68 |           </ButtonWithConfirm>
```

</details>

---

#### 321. [`src/pages/VM/pages/vulnerability-report/components/options.jsx:80`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx#L80)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx`
- **Line Number**: `80`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    79 |           onConfirm={() => downloadReport(vulnId)}
>   80 |           confirmButton={<Button variant="primary">Proceed</Button>}
    81 |           cancelButton={<Button variant="outline">Cancel</Button>}
    82 |         >
    83 |           <Download size={14} />
```

</details>

---

#### 322. [`src/pages/VM/pages/vulnerability-report/components/options.jsx:81`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx#L81)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx`
- **Line Number**: `81`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    80 |           confirmButton={<Button variant="primary">Proceed</Button>}
>   81 |           cancelButton={<Button variant="outline">Cancel</Button>}
    82 |         >
    83 |           <Download size={14} />
    84 |         </ButtonWithConfirm>
```

</details>

---

#### 323. [`src/pages/VM/pages/vulnerability-report/components/options.jsx:97`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx#L97)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx`
- **Line Number**: `97`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    96 |             confirmButton={
>   97 |               <Button variant="primary" disabled={isDuplicating}>
    98 |                 Proceed
    99 |               </Button>
   100 |             }
```

</details>

---

#### 324. [`src/pages/VM/pages/vulnerability-report/components/options.jsx:101`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx#L101)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/options.jsx`
- **Line Number**: `101`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   100 |             }
>  101 |             cancelButton={<Button variant="outline">Cancel</Button>}
   102 |           >
   103 |             <CopyPlus size={14} />
   104 |           </ButtonWithConfirm>
```

</details>

---

#### 325. [`src/pages/VM/pages/vulnerability-report/components/report-details/duplicate-info.jsx:33`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/duplicate-info.jsx#L33)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/duplicate-info.jsx`
- **Line Number**: `33`
- **Button Label**: `Submit`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Submit" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Submit</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    32 |                 <div>
>   33 |                     <Button onClick={() => onSubmit()}>Submit</Button>
    34 |                 </div>
    35 |             }
    36 |         >
```

</details>

---

#### 326. [`src/pages/VM/pages/vulnerability-report/components/report-details/revalidation-info.jsx:68`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/revalidation-info.jsx#L68)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/revalidation-info.jsx`
- **Line Number**: `68`
- **Button Label**: `Submit`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Submit" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Submit</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    67 |           <div>
>   68 |             <Button onClick={() => onSubmit()}>Submit</Button>
    69 |           </div>
    70 |         }
    71 |       >
```

</details>

---

#### 327. [`src/pages/VM/pages/vulnerability-report/components/report-details/risk-acceptance-form.jsx:173`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/risk-acceptance-form.jsx#L173)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/risk-acceptance-form.jsx`
- **Line Number**: `173`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   172 |           <DialogFooter>
>  173 |             <Button type="button" variant="outline" onClick={onClose}>
   174 |               Cancel
   175 |             </Button>
   176 |             <Button type="submit" disabled={isLoading} variant="outline">
```

</details>

---

#### 328. [`src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx:226`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx#L226)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx`
- **Line Number**: `226`
- **Button Label**: `Add Revalidation`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Add Revalidation" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Add Revalidation</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   225 |                 (displayAddRevalidationButton ? (
>  226 |                   <Button
   227 |                     variant="outline"
   228 |                     onClick={handleOpenRevalidationModal}
   229 |                   >
```

</details>

---

#### 329. [`src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx:233`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx#L233)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx`
- **Line Number**: `233`
- **Button Label**: `Add Evidence`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Add Evidence" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Add Evidence</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   232 |                 ) : displayAddEvidenceButton ? (
>  233 |                   <Button
   234 |                     variant="outline"
   235 |                     onClick={handleOpenRevalidationModal}
   236 |                   >
```

</details>

---

#### 330. [`src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx:240`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx#L240)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx`
- **Line Number**: `240`
- **Button Label**: `Change Revalidation`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Change Revalidation" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Change Revalidation</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   239 |                 ) : displayChangeRevalidationButton ? (
>  240 |                   <Button
   241 |                     variant="outline"
   242 |                     onClick={handleOpenRevalidationModal}
   243 |                   >
```

</details>

---

#### 331. [`src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx:324`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx#L324)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx`
- **Line Number**: `324`
- **Button Label**: `Yes, Claim Ownership`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Yes, Claim Ownership" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Yes, Claim Ownership</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   323 |         }
>  324 |         confirmButton={<Button>Yes, Claim Ownership</Button>}
   325 |         cancelButton={
   326 |           <Button variant="outline" onClick={() => performUpdate(false)}>
   327 |             No
```

</details>

---

#### 332. [`src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx:326`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx#L326)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/state.jsx`
- **Line Number**: `326`
- **Button Label**: `No`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "No" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>No</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   325 |         cancelButton={
>  326 |           <Button variant="outline" onClick={() => performUpdate(false)}>
   327 |             No
   328 |           </Button>
   329 |         }
```

</details>

---

#### 333. [`src/pages/VM/pages/vulnerability-report/components/report-details/ticketing-solutions/jira.jsx:58`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/ticketing-solutions/jira.jsx#L58)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/ticketing-solutions/jira.jsx`
- **Line Number**: `58`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    57 |             dialog="This will send this Vulnerability to Jira. Proceed?"
>   58 |             confirmButton={<Button variant="primary">Proceed</Button>}
    59 |             cancelButton={<Button variant="outline">Cancel</Button>}
    60 |             {...props}
    61 |           >
```

</details>

---

#### 334. [`src/pages/VM/pages/vulnerability-report/components/report-details/ticketing-solutions/jira.jsx:59`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/ticketing-solutions/jira.jsx#L59)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/ticketing-solutions/jira.jsx`
- **Line Number**: `59`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    58 |             confirmButton={<Button variant="primary">Proceed</Button>}
>   59 |             cancelButton={<Button variant="outline">Cancel</Button>}
    60 |             {...props}
    61 |           >
    62 |             {isSending ? (
```

</details>

---

#### 335. [`src/pages/VM/pages/vulnerability-report/components/report-details/ticketing-solutions/jira.jsx:81`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/ticketing-solutions/jira.jsx#L81)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-report/components/report-details/ticketing-solutions/jira.jsx`
- **Line Number**: `81`
- **Button Label**: `Integrate Adapter`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Integrate Adapter" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plug className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plug className="size-4" />
  <span>Integrate Adapter</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    80 |                 <Link to={'/vm/integrations'}>
>   81 |                   <Button variant="outline">Integrate Adapter</Button>
    82 |                 </Link>
    83 |               )}
    84 |           </TableCell>
```

</details>

---

#### 336. [`src/pages/VM/pages/vulnerability-sources/components/dialogs/SourceDetailDialog.jsx:36`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-sources/components/dialogs/SourceDetailDialog.jsx#L36)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-sources/components/dialogs/SourceDetailDialog.jsx`
- **Line Number**: `36`
- **Button Label**: `Close`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Close" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Close</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    35 |       footer={
>   36 |         <Button
    37 |           variant="outline"
    38 |           className="w-full"
    39 |           onClick={() => setOpen(false)}
```

</details>

---

#### 337. [`src/pages/VM/pages/vulnerability-sources/components/dialogs/SourceFormDialog.jsx:105`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-sources/components/dialogs/SourceFormDialog.jsx#L105)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-sources/components/dialogs/SourceFormDialog.jsx`
- **Line Number**: `105`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   104 |         <div className="flex gap-3 justify-end w-full">
>  105 |           <Button variant="outline" size="md" onClick={() => setOpen(false)}>
   106 |             Cancel
   107 |           </Button>
   108 |           <Button
```

</details>

---

#### 338. [`src/pages/VM/pages/vulnerability-sources/components/dialogs/SourceFormDialog.jsx:108`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-sources/components/dialogs/SourceFormDialog.jsx#L108)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VM/pages/vulnerability-sources/components/dialogs/SourceFormDialog.jsx`
- **Line Number**: `108`
- **Button Label**: `Save Changes / Add Source`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes / Add Source" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes / Add Source</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   107 |           </Button>
>  108 |           <Button
   109 |             variant="primary"
   110 |             size="md"
   111 |             onClick={handleSubmit}
```

</details>

---

### Pages: VS

#### 339. [`src/pages/VS/pages/agents/components/agent-action-cell.jsx:48`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/agents/components/agent-action-cell.jsx#L48)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/agents/components/agent-action-cell.jsx`
- **Line Number**: `48`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    47 |             confirmButton={
>   48 |               <Button variant="destructive" disabled={isDeleting}>
    49 |                 Delete
    50 |               </Button>
    51 |             }
```

</details>

---

#### 340. [`src/pages/VS/pages/agents/components/agent-action-cell.jsx:52`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/agents/components/agent-action-cell.jsx#L52)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/agents/components/agent-action-cell.jsx`
- **Line Number**: `52`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    51 |             }
>   52 |             cancelButton={<Button variant="outline">Cancel</Button>}
    53 |             className="w-full justify-start !font-normal cursor-pointer !text-inherit px-2 py-1.5 text-sm h-8"
    54 |           >
    55 |             <span className="text-destructive">Delete</span>
```

</details>

---

#### 341. [`src/pages/VS/pages/assets/components/actions/delete-asset-group.jsx:36`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/actions/delete-asset-group.jsx#L36)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/actions/delete-asset-group.jsx`
- **Line Number**: `36`
- **Button Label**: `Remove`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Remove" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Remove</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    35 |       confirmButton={
>   36 |         <Button disabled={isRemoving} variant="destructive">
    37 |           Remove
    38 |         </Button>
    39 |       }
```

</details>

---

#### 342. [`src/pages/VS/pages/assets/components/actions/delete-asset-group.jsx:41`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/actions/delete-asset-group.jsx#L41)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/actions/delete-asset-group.jsx`
- **Line Number**: `41`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    40 |       cancelButton={
>   41 |         <Button disabled={isRemoving} variant="outline">
    42 |           Cancel
    43 |         </Button>
    44 |       }
```

</details>

---

#### 343. [`src/pages/VS/pages/assets/components/add-group.jsx:58`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/add-group.jsx#L58)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/add-group.jsx`
- **Line Number**: `58`
- **Button Label**: `Cancel`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    57 |                 <div className="w-full flex gap-2 items-center justify-end">
>   58 |                     <Button variant="destructive" onClick={() => setShowAddGroupModal(false)} >
    59 |                         Cancel
    60 |                     </Button>    
    61 |                     <Button disabled={isAdding || !selectedGroup || !selectedAsset} onClick={() => handleAddToGroup()}>
```

</details>

---

#### 344. [`src/pages/VS/pages/assets/components/add-group.jsx:61`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/add-group.jsx#L61)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/add-group.jsx`
- **Line Number**: `61`
- **Button Label**: `Adding / Add To Group`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Adding / Add To Group" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Adding / Add To Group</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    60 |                     </Button>    
>   61 |                     <Button disabled={isAdding || !selectedGroup || !selectedAsset} onClick={() => handleAddToGroup()}>
    62 |                         {isAdding ? "Adding" : "Add To Group"}
    63 |                     </Button>    
    64 |                 </div>
```

</details>

---

#### 345. [`src/pages/VS/pages/assets/components/bulk-update-floating-bar.jsx:127`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/bulk-update-floating-bar.jsx#L127)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/bulk-update-floating-bar.jsx`
- **Line Number**: `127`
- **Button Label**: `Add`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Add" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Add</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   126 |                             />
>  127 |                             <Button size="sm" onClick={handleBulkAddToGroup} disabled={!selectedGroup || isAddingToGroup}>
   128 |                                 Add
   129 |                             </Button>
   130 |                              {/* <Button size="sm" variant="ghost" onClick={() => setShowGroupSelect(false)}><Trash2 size={14}/></Button> */}
```

</details>

---

#### 346. [`src/pages/VS/pages/assets/components/bulk-update-floating-bar.jsx:173`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/bulk-update-floating-bar.jsx#L173)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/bulk-update-floating-bar.jsx`
- **Line Number**: `173`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   172 |                 onConfirm={handleBulkDelete}
>  173 |                 confirmButton={<Button variant="primary">Proceed</Button>}
   174 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   175 |                 className="text-destructive hover:text-destructive hover:bg-red-200/20"
   176 |               >
```

</details>

---

#### 347. [`src/pages/VS/pages/assets/components/bulk-update-floating-bar.jsx:174`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/bulk-update-floating-bar.jsx#L174)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/bulk-update-floating-bar.jsx`
- **Line Number**: `174`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   173 |                 confirmButton={<Button variant="primary">Proceed</Button>}
>  174 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   175 |                 className="text-destructive hover:text-destructive hover:bg-red-200/20"
   176 |               >
   177 |                 <Trash2 size={14} />
```

</details>

---

#### 348. [`src/pages/VS/pages/assets/components/ui/actions-cell.jsx:106`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/ui/actions-cell.jsx#L106)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/ui/actions-cell.jsx`
- **Line Number**: `106`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   105 |           <div className="flex justify-end gap-3">
>  106 |             <Button variant="outline" onClick={() => setIsChangeOwnerOpen(false)}>
   107 |               Cancel
   108 |             </Button>
   109 |             <Button onClick={handleActions.changeOwner}>
```

</details>

---

#### 349. [`src/pages/VS/pages/assets/components/ui/actions-cell.jsx:109`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/ui/actions-cell.jsx#L109)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/assets/components/ui/actions-cell.jsx`
- **Line Number**: `109`
- **Button Label**: `Update Owner`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Update Owner" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Update Owner</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   108 |             </Button>
>  109 |             <Button onClick={handleActions.changeOwner}>
   110 |               Update Owner
   111 |             </Button>
   112 |           </div>
```

</details>

---

#### 350. [`src/pages/VS/pages/groups/components/cards/group-info-card.jsx:76`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/groups/components/cards/group-info-card.jsx#L76)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/groups/components/cards/group-info-card.jsx`
- **Line Number**: `76`
- **Button Label**: `Assets`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Assets" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>Assets</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    75 | 
>   76 |             <Button mode="link" underlined="dashed" onClick={() => setIsViewAssetsModalOpen(true)}>
    77 |               {item?.totalAssets}
    78 |               <p className=" text-xs">Assets</p>
    79 |             </Button>
```

</details>

---

#### 351. [`src/pages/VS/pages/groups/components/dropdowns/group-info-card-dropdown.jsx:80`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/groups/components/dropdowns/group-info-card-dropdown.jsx#L80)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/groups/components/dropdowns/group-info-card-dropdown.jsx`
- **Line Number**: `80`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    79 |                 }}
>   80 |                 confirmButton={<Button variant="destructive">Delete</Button>}
    81 |                 cancelButton={<Button variant="outline">Cancel</Button>}
    82 |                 className="w-full justify-start text-destructive hover:text-destructive hover:bg-red-200/20 "
    83 |               >
```

</details>

---

#### 352. [`src/pages/VS/pages/groups/components/dropdowns/group-info-card-dropdown.jsx:81`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/groups/components/dropdowns/group-info-card-dropdown.jsx#L81)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/groups/components/dropdowns/group-info-card-dropdown.jsx`
- **Line Number**: `81`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    80 |                 confirmButton={<Button variant="destructive">Delete</Button>}
>   81 |                 cancelButton={<Button variant="outline">Cancel</Button>}
    82 |                 className="w-full justify-start text-destructive hover:text-destructive hover:bg-red-200/20 "
    83 |               >
    84 |                 {option.icon}
```

</details>

---

#### 353. [`src/pages/VS/pages/integrations/components/actions/delete-aim-integration.jsx:37`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/integrations/components/actions/delete-aim-integration.jsx#L37)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/integrations/components/actions/delete-aim-integration.jsx`
- **Line Number**: `37`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    36 |       confirmButton={
>   37 |         <Button variant="destructive" disabled={isDeleting}>
    38 |           Delete
    39 |         </Button>
    40 |       }
```

</details>

---

#### 354. [`src/pages/VS/pages/integrations/components/actions/delete-aim-integration.jsx:41`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/integrations/components/actions/delete-aim-integration.jsx#L41)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/integrations/components/actions/delete-aim-integration.jsx`
- **Line Number**: `41`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    40 |       }
>   41 |       cancelButton={<Button variant="outline">Cancel</Button>}
    42 |     >
    43 |       <Trash className="size-4" />
    44 |       <span>Delete</span>
```

</details>

---

#### 355. [`src/pages/VS/pages/integrations/components/aim-integration.jsx:106`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/integrations/components/aim-integration.jsx#L106)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/integrations/components/aim-integration.jsx`
- **Line Number**: `106`
- **Button Label**: `Refresh`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Refresh" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Refresh</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   105 |               confirmButton={
>  106 |                 <Button disabled={isRefreshing}>
   107 |                   Refresh
   108 |                 </Button>
   109 |               }
```

</details>

---

#### 356. [`src/pages/VS/pages/integrations/components/aim-integration.jsx:110`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/integrations/components/aim-integration.jsx#L110)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/integrations/components/aim-integration.jsx`
- **Line Number**: `110`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   109 |               }
>  110 |               cancelButton={<Button variant="outline">Cancel</Button>}
   111 |             >
   112 |               <RefreshCcw /> Refresh
   113 |             </ButtonWithConfirm>
```

</details>

---

#### 357. [`src/pages/VS/pages/integrations/components/aim-integration.jsx:125`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/integrations/components/aim-integration.jsx#L125)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/integrations/components/aim-integration.jsx`
- **Line Number**: `125`
- **Button Label**: `Install`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Install" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Download className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Download className="size-4" />
  <span>Install</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   124 |             dialog={<p>Are you sure you want to install this integration?</p>}
>  125 |             confirmButton={<Button>Install</Button>}
   126 |             onConfirm={handleInstallAdapter}
   127 |           >
   128 |             <Download /> Install
```

</details>

---

#### 358. [`src/pages/VS/pages/scan-details/tabs/vulnerabilities-tab.jsx:278`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/scan-details/tabs/vulnerabilities-tab.jsx#L278)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/scan-details/tabs/vulnerabilities-tab.jsx`
- **Line Number**: `278`
- **Button Label**: `Goto Scans`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Goto Scans" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Goto Scans</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   277 |                     engage={
>  278 |                         <Button onClick={() => navigate('/vs/scans')}>
   279 |                             Goto Scans
   280 |                         </Button>
   281 |                     }
```

</details>

---

#### 359. [`src/pages/VS/pages/scan-details/tabs/vulnerabilities-tab.jsx:292`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/scan-details/tabs/vulnerabilities-tab.jsx#L292)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/scan-details/tabs/vulnerabilities-tab.jsx`
- **Line Number**: `292`
- **Button Label**: `Goto Scans`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Goto Scans" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Goto Scans</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   291 |                     engage={
>  292 |                         <Button onClick={() => navigate('/vs/scans')}>
   293 |                             Goto Scans
   294 |                         </Button>
   295 |                     }
```

</details>

---

#### 360. [`src/pages/VS/pages/suppression-rules/rules.jsx:104`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/suppression-rules/rules.jsx#L104)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/suppression-rules/rules.jsx`
- **Line Number**: `104`
- **Button Label**: `Clear All Filters`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Clear All Filters" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Filter className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Filter className="size-4" />
  <span>Clear All Filters</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   103 |               engage={
>  104 |                 <Button
   105 |                   variant="outline"
   106 |                   onClick={() => window.location.reload()}
   107 |                 >
```

</details>

---

#### 361. [`src/pages/VS/pages/vulnerabilities/components/VulnList.jsx:103`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/VulnList.jsx#L103)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/VulnList.jsx`
- **Line Number**: `103`
- **Button Label**: `Confirm`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Confirm" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Confirm</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   102 |           dialog="Are you sure you want to send this vulnerability to Vulnerability Management? This will create a new ticket."
>  103 |           confirmButton={<Button disabled={isSyncing}>Confirm</Button>}
   104 |         >
   105 |           <RefreshCcw size={12} className={isSyncing ? 'animate-spin' : ''} />
   106 |           Send to VM
```

</details>

---

#### 362. [`src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx:79`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx#L79)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `79`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    78 |               onConfirm={handleBulkUnSuppress}
>   79 |               confirmButton={<Button variant="primary">Proceed</Button>}
    80 |               cancelButton={<Button variant="outline">Cancel</Button>}
    81 |               title="Unsuppress Vulnerabilities"
    82 |               description={`Are you sure you want to unsuppress ${vulnIds.length} vulnerabilities?`}
```

</details>

---

#### 363. [`src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx:80`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx#L80)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `80`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    79 |               confirmButton={<Button variant="primary">Proceed</Button>}
>   80 |               cancelButton={<Button variant="outline">Cancel</Button>}
    81 |               title="Unsuppress Vulnerabilities"
    82 |               description={`Are you sure you want to unsuppress ${vulnIds.length} vulnerabilities?`}
    83 |             >
```

</details>

---

#### 364. [`src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx:84`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx#L84)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `84`
- **Button Label**: `Unsuppress`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Unsuppress" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <EyeOff className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <EyeOff className="size-4" />
  <span>Unsuppress</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    83 |             >
>   84 |               <Button variant={'outline'}>Unsuppress</Button>
    85 |             </ButtonWithConfirm>
    86 |           ) : (
    87 |             <ButtonWithConfirm
```

</details>

---

#### 365. [`src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx:92`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx#L92)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `92`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    91 |               onConfirm={handleBulkSuppress}
>   92 |               confirmButton={<Button variant="primary">Proceed</Button>}
    93 |               cancelButton={<Button variant="outline">Cancel</Button>}
    94 |               title="Suppress Vulnerabilities"
    95 |               description={`Are you sure you want to suppress ${vulnIds.length} vulnerabilities?`}
```

</details>

---

#### 366. [`src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx:93`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx#L93)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `93`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    92 |               confirmButton={<Button variant="primary">Proceed</Button>}
>   93 |               cancelButton={<Button variant="outline">Cancel</Button>}
    94 |               title="Suppress Vulnerabilities"
    95 |               description={`Are you sure you want to suppress ${vulnIds.length} vulnerabilities?`}
    96 |             >
```

</details>

---

#### 367. [`src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx:97`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx#L97)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `97`
- **Button Label**: `Suppress`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Suppress" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <EyeOff className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <EyeOff className="size-4" />
  <span>Suppress</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    96 |             >
>   97 |               <Button variant={'outline'}>Suppress</Button>
    98 |             </ButtonWithConfirm>
    99 |           )
   100 |         )}
```

</details>

---

#### 368. [`src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx:107`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx#L107)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `107`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   106 |           onConfirm={handleBulkSendToVm}
>  107 |           confirmButton={<Button variant="primary">Proceed</Button>}
   108 |           cancelButton={<Button variant="outline">Cancel</Button>}
   109 |           title="Send to VM"
   110 |           description={`Are you sure you want to send ${vulnIds.length} vulnerabilities to VM?`}
```

</details>

---

#### 369. [`src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx:108`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx#L108)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `108`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   107 |           confirmButton={<Button variant="primary">Proceed</Button>}
>  108 |           cancelButton={<Button variant="outline">Cancel</Button>}
   109 |           title="Send to VM"
   110 |           description={`Are you sure you want to send ${vulnIds.length} vulnerabilities to VM?`}
   111 |         >
```

</details>

---

#### 370. [`src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx:112`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx#L112)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `112`
- **Button Label**: `Send to VM`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Send to VM" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Send className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Send className="size-4" />
  <span>Send to VM</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   111 |         >
>  112 |           <Button variant={'outline'} disabled={isAuditor}>Send to VM</Button>
   113 |         </ButtonWithConfirm>
   114 |       </div>
   115 |     </FloatingCard>
```

</details>

---

#### 371. [`src/pages/VS/pages/vulnerabilities/components/vuln-info.jsx:309`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/vuln-info.jsx#L309)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/vuln-info.jsx`
- **Line Number**: `309`
- **Button Label**: `Un-Suppress`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Un-Suppress" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <EyeOff className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <EyeOff className="size-4" />
  <span>Un-Suppress</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   308 |               ) : (
>  309 |                 <Button
   310 |                   disabled={isUnsuppressing}
   311 |                   variant="outline"
   312 |                   className="text-primary hover:bg-primary/10"
```

</details>

---

#### 372. [`src/pages/VS/pages/vulnerabilities/components/vuln-info.jsx:332`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/vuln-info.jsx#L332)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/VS/pages/vulnerabilities/components/vuln-info.jsx`
- **Line Number**: `332`
- **Button Label**: `View Ticket`
- **Current Variant**: `secondary`
- **Issue**: **Missing Icon**: The button with label "View Ticket" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>View Ticket</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   331 |             ) : (
>  332 |               <Button
   333 |                 variant="secondary"
   334 |                 onClick={() =>
   335 |                   window.open(
```

</details>

---

### Pages: WAS

#### 373. [`src/pages/WAS/category-rules/components/actions/delete-rule.jsx:28`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/category-rules/components/actions/delete-rule.jsx#L28)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/category-rules/components/actions/delete-rule.jsx`
- **Line Number**: `28`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    27 |         onConfirm={() => handleDeleteScan()}
>   28 |         confirmButton={<Button variant="destructive">Delete</Button>}
    29 |         cancelButton={<Button variant="outline">Cancel</Button>}
    30 |         className={iconOnly ? " text-destructive hover:bg-red-200/20" : "flex hover:bg-red-200/20"}
    31 |         {...props}
```

</details>

---

#### 374. [`src/pages/WAS/category-rules/components/actions/delete-rule.jsx:29`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/category-rules/components/actions/delete-rule.jsx#L29)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/category-rules/components/actions/delete-rule.jsx`
- **Line Number**: `29`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    28 |         confirmButton={<Button variant="destructive">Delete</Button>}
>   29 |         cancelButton={<Button variant="outline">Cancel</Button>}
    30 |         className={iconOnly ? " text-destructive hover:bg-red-200/20" : "flex hover:bg-red-200/20"}
    31 |         {...props}
    32 |       >
```

</details>

---

#### 375. [`src/pages/WAS/environment/environment.jsx:86`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/environment/environment.jsx#L86)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/environment/environment.jsx`
- **Line Number**: `86`
- **Button Label**: `Go to integrations`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Go to integrations" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Go to integrations</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    85 |         engage={
>   86 |           <Button onClick={() => navigate('/was/integrations')}>
    87 |             Go to integrations
    88 |           </Button>
    89 |         }
```

</details>

---

#### 376. [`src/pages/WAS/integration/components/actions/confirm-adapter-installation-btn.jsx:57`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/actions/confirm-adapter-installation-btn.jsx#L57)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/actions/confirm-adapter-installation-btn.jsx`
- **Line Number**: `57`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    56 |       confirmButton={
>   57 |         <Button variant="primary" disabled={isIntegratingAdptr}>
    58 |           Proceed
    59 |         </Button>
    60 |       }
```

</details>

---

#### 377. [`src/pages/WAS/integration/components/actions/confirm-adapter-installation-btn.jsx:61`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/actions/confirm-adapter-installation-btn.jsx#L61)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/actions/confirm-adapter-installation-btn.jsx`
- **Line Number**: `61`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    60 |       }
>   61 |       cancelButton={<Button variant="outline">Cancel</Button>}
    62 |     >
    63 |       <Download /> Install
    64 |     </ButtonWithConfirm>
```

</details>

---

#### 378. [`src/pages/WAS/integration/components/cards/actions/delete-adapter.jsx:37`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/cards/actions/delete-adapter.jsx#L37)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/cards/actions/delete-adapter.jsx`
- **Line Number**: `37`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    36 |       onConfirm={() => deleteActvAdapter()}
>   37 |       confirmButton={<Button variant="primary">Proceed</Button>}
    38 |       cancelButton={<Button variant="outline">Cancel</Button>}
    39 |       dialog={
    40 |         <div className=" flex flex-col items-center">
```

</details>

---

#### 379. [`src/pages/WAS/integration/components/cards/actions/delete-adapter.jsx:38`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/cards/actions/delete-adapter.jsx#L38)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/cards/actions/delete-adapter.jsx`
- **Line Number**: `38`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    37 |       confirmButton={<Button variant="primary">Proceed</Button>}
>   38 |       cancelButton={<Button variant="outline">Cancel</Button>}
    39 |       dialog={
    40 |         <div className=" flex flex-col items-center">
    41 |           <p>Are you sure want to delete this adapter?</p>
```

</details>

---

#### 380. [`src/pages/WAS/integration/components/cards/adapter-info-card.jsx:159`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/cards/adapter-info-card.jsx#L159)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/cards/adapter-info-card.jsx`
- **Line Number**: `159`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   158 |               onConfirm={() => deleteActvAdapter()}
>  159 |               confirmButton={<Button variant="primary">Proceed</Button>}
   160 |               cancelButton={<Button variant="outline">Cancel</Button>}
   161 |               dialog={
   162 |                 <div className=" flex flex-col items-center">
```

</details>

---

#### 381. [`src/pages/WAS/integration/components/cards/adapter-info-card.jsx:160`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/cards/adapter-info-card.jsx#L160)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/integration/components/cards/adapter-info-card.jsx`
- **Line Number**: `160`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   159 |               confirmButton={<Button variant="primary">Proceed</Button>}
>  160 |               cancelButton={<Button variant="outline">Cancel</Button>}
   161 |               dialog={
   162 |                 <div className=" flex flex-col items-center">
   163 |                   <p>Are you sure want to delete this adapter?</p>
```

</details>

---

#### 382. [`src/pages/WAS/project-detail/components/Tabs/scan-settings.jsx:164`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/Tabs/scan-settings.jsx#L164)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/Tabs/scan-settings.jsx`
- **Line Number**: `164`
- **Button Label**: `Once`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Once" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Calendar className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Calendar className="size-4" />
  <span>Once</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   163 |                         <div className="grid grid-cols-3 gap-2">
>  164 |                             <Button
   165 |                                 variant={frequency === 'Once' ? 'secondary' : 'outline'}
   166 |                                 onClick={() => setFrequency('Once')}
   167 |                             >
```

</details>

---

#### 383. [`src/pages/WAS/project-detail/components/Tabs/scan-settings.jsx:170`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/Tabs/scan-settings.jsx#L170)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/Tabs/scan-settings.jsx`
- **Line Number**: `170`
- **Button Label**: `Daily`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Daily" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Calendar className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Calendar className="size-4" />
  <span>Daily</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   169 |                             </Button>
>  170 |                             <Button
   171 |                                 variant={frequency === 'Daily' ? 'secondary' : 'outline'}
   172 |                                 onClick={() => setFrequency('Daily')}
   173 |                             >
```

</details>

---

#### 384. [`src/pages/WAS/project-detail/components/Tabs/scan-settings.jsx:176`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/Tabs/scan-settings.jsx#L176)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/Tabs/scan-settings.jsx`
- **Line Number**: `176`
- **Button Label**: `Weekly`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Weekly" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Calendar className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Calendar className="size-4" />
  <span>Weekly</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   175 |                             </Button>
>  176 |                             <Button
   177 |                                 variant={frequency === 'Weekly' ? 'secondary' : 'outline'}
   178 |                                 onClick={() => setFrequency('Weekly')}
   179 |                             >
```

</details>

---

#### 385. [`src/pages/WAS/project-detail/components/Tabs/threat-actions.jsx:56`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/Tabs/threat-actions.jsx#L56)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/Tabs/threat-actions.jsx`
- **Line Number**: `56`
- **Button Label**: `View Ticket`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "View Ticket" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>View Ticket</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    55 |         {vuln?.sentToVm ? (
>   56 |           <Button
    57 |             variant="ghost"
    58 |             onClick={() => window.open(`/vm/vulnerability-report?id=${vuln?.universalVulnId}&assessmentId=${vuln?.assessmentId}`, '_blank')}
    59 |             className="w-full justify-start px-2 py-1.5 h-auto font-normal text-[0.8125rem] rounded-md hover:bg-accent text-left bg-transparent"
```

</details>

---

#### 386. [`src/pages/WAS/project-detail/components/Tabs/threats.jsx:226`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/Tabs/threats.jsx#L226)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/Tabs/threats.jsx`
- **Line Number**: `226`
- **Button Label**: `Go to Scan Settings`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Go to Scan Settings" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Go to Scan Settings</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   225 |           <AuthorityGuard forbidRoles={['Auditor']}>
>  226 |             <Button
   227 |               onClick={() => {
   228 |                 navigate('?tab=scan-settings');
   229 |               }}
```

</details>

---

#### 387. [`src/pages/WAS/project-detail/components/basic-details.jsx:370`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/basic-details.jsx#L370)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/basic-details.jsx`
- **Line Number**: `370`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   369 |                     variant="destructive"
>  370 |                     confirmButton={<Button variant="destructive">Delete</Button>}
   371 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   372 |                   >
   373 |                     Delete
```

</details>

---

#### 388. [`src/pages/WAS/project-detail/components/basic-details.jsx:371`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/basic-details.jsx#L371)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/basic-details.jsx`
- **Line Number**: `371`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   370 |                     confirmButton={<Button variant="destructive">Delete</Button>}
>  371 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   372 |                   >
   373 |                     Delete
   374 |                   </ButtonWithConfirm>
```

</details>

---

#### 389. [`src/pages/WAS/project-detail/components/instant-scan-modal/index.jsx:138`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/instant-scan-modal/index.jsx#L138)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/instant-scan-modal/index.jsx`
- **Line Number**: `138`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   137 |                 <DialogFooter className="flex-shrink-0 mt-2">
>  138 |                     <Button
   139 |                         variant="outline"
   140 |                         onClick={() => onOpenChange(false)}
   141 |                         disabled={isLaunching}
```

</details>

---

#### 390. [`src/pages/WAS/project-detail/components/request-comparison.jsx:297`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/request-comparison.jsx#L297)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/request-comparison.jsx`
- **Line Number**: `297`
- **Button Label**: `Close`
- **Current Variant**: `secondary`
- **Issue**: **Missing Icon**: The button with label "Close" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Close</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   296 |           </div>
>  297 |           <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto px-10 h-10 font-bold uppercase tracking-wider text-xs">
   298 |             Close
   299 |           </Button>
   300 |         </div>
```

</details>

---

#### 391. [`src/pages/WAS/project-detail/components/scanner-config-modal/auth-script-editor-modal.jsx:81`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/auth-script-editor-modal.jsx#L81)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/auth-script-editor-modal.jsx`
- **Line Number**: `81`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    80 |                 <DialogFooter className="p-6 pt-2 bg-muted/20 border-t">
>   81 |                     <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
    82 |                         Cancel
    83 |                     </Button>
    84 |                     <Button
```

</details>

---

#### 392. [`src/pages/WAS/project-detail/components/scanner-config-modal/auth-script-editor-modal.jsx:84`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/auth-script-editor-modal.jsx#L84)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/auth-script-editor-modal.jsx`
- **Line Number**: `84`
- **Button Label**: `Saving... / Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    83 |                     </Button>
>   84 |                     <Button
    85 |                         variant="primary"
    86 |                         onClick={handleSave}
    87 |                         disabled={isUpdating || isFetching}
```

</details>

---

#### 393. [`src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx:421`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx#L421)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx`
- **Line Number**: `421`
- **Button Label**: `Testing... / Test Script`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon & Invalid Ghost Variant**: This button represents an actionable operation ("Testing... / Test Script") but is rendered with `variant="ghost"` instead of `variant="primary"`, and is missing a contextually relevant icon.

**Suggested Change**:

Update the Button to use `variant="primary"` and include <Play className="size-4" /> from `lucide-react` alongside the label:
```jsx
<Button variant="primary" ...>
  <Play className="size-4" />
  <span>Testing... / Test Script</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   420 |                                     </div>
>  421 |                                     <Button
   422 |                                         variant="ghost"
   423 |                                         size="sm"
   424 |                                         onClick={handleTestScript}
```

</details>

---

#### 394. [`src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx:430`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx#L430)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx`
- **Line Number**: `430`
- **Button Label**: `Edit Script`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Edit Script" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Edit Script</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   429 |                                     </Button>
>  430 |                                     <Button
   431 |                                         variant="ghost"
   432 |                                         size="sm"
   433 |                                         onClick={() => setShowEditModal(true)}
```

</details>

---

#### 395. [`src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx:438`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx#L438)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx`
- **Line Number**: `438`
- **Button Label**: `Change`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Change" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Change</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   437 |                                     </Button>
>  438 |                                     <Button
   439 |                                         variant="ghost"
   440 |                                         size="sm"
   441 |                                         onClick={() => {
```

</details>

---

#### 396. [`src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx:511`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx#L511)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx`
- **Line Number**: `511`
- **Button Label**: `Testing... / Test Script`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon & Invalid Ghost Variant**: This button represents an actionable operation ("Testing... / Test Script") but is rendered with `variant="ghost"` instead of `variant="primary"`, and is missing a contextually relevant icon.

**Suggested Change**:

Update the Button to use `variant="primary"` and include <Play className="size-4" /> from `lucide-react` alongside the label:
```jsx
<Button variant="primary" ...>
  <Play className="size-4" />
  <span>Testing... / Test Script</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   510 |                                     </div>
>  511 |                                     <Button
   512 |                                         variant="ghost"
   513 |                                         size="sm"
   514 |                                         onClick={handleTestScript2}
```

</details>

---

#### 397. [`src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx:520`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx#L520)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/configuration-tab.jsx`
- **Line Number**: `520`
- **Button Label**: `Change`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Change" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Change</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   519 |                                     </Button>
>  520 |                                     <Button
   521 |                                         variant="ghost"
   522 |                                         size="sm"
   523 |                                         onClick={() => {
```

</details>

---

#### 398. [`src/pages/WAS/project-detail/components/scanner-config-modal/index.jsx:164`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/index.jsx#L164)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/index.jsx`
- **Line Number**: `164`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   163 |                 <DialogFooter className="flex-shrink-0 flex justify-between sm:justify-between">
>  164 |                     <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
   165 |                         Cancel
   166 |                     </Button>
   167 |                     <div className="flex gap-2">
```

</details>

---

#### 399. [`src/pages/WAS/project-detail/components/scanner-config-modal/index.jsx:168`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/index.jsx#L168)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/index.jsx`
- **Line Number**: `168`
- **Button Label**: `Saving... / Save & Deploy`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save & Deploy" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save & Deploy</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   167 |                     <div className="flex gap-2">
>  168 |                         <Button
   169 |                             variant="primary"
   170 |                             onClick={() => handleSave(false)}
   171 |                             disabled={isUpdating || !isFormValid}
```

</details>

---

#### 400. [`src/pages/WAS/project-detail/components/scanner-config-modal/scanner-settings-tab.jsx:113`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/scanner-settings-tab.jsx#L113)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/scanner-config-modal/scanner-settings-tab.jsx`
- **Line Number**: `113`
- **Button Label**: `Change`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Change" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Change</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   112 |                         </div>
>  113 |                         <Button
   114 |                             variant="ghost"
   115 |                             size="sm"
   116 |                             onClick={() => setShowFileUpload(true)}
```

</details>

---

#### 401. [`src/pages/WAS/project-detail/components/web-app-components/authentication.jsx:137`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/web-app-components/authentication.jsx#L137)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/project-detail/components/web-app-components/authentication.jsx`
- **Line Number**: `137`
- **Button Label**: `Upload again`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Upload again" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Upload again</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   136 |             </div>
>  137 |             <Button
   138 |               variant="outline"
   139 |               size="sm"
   140 |               onClick={() => setShowFileUploadComponent(true)}
```

</details>

---

#### 402. [`src/pages/WAS/projects/components/dropdown-actions.jsx:70`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/projects/components/dropdown-actions.jsx#L70)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/projects/components/dropdown-actions.jsx`
- **Line Number**: `70`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    69 |                             confirmButton={
>   70 |                                 <Button variant="primary" >
    71 |                                     Proceed
    72 |                                 </Button>
    73 |                             }
```

</details>

---

#### 403. [`src/pages/WAS/projects/components/dropdown-actions.jsx:74`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/projects/components/dropdown-actions.jsx#L74)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/projects/components/dropdown-actions.jsx`
- **Line Number**: `74`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    73 |                             }
>   74 |                             cancelButton={<Button variant="outline">Cancel</Button>}>
    75 |                             <Trash2 /> Delete
    76 |                         </ButtonWithConfirm>
    77 |                     </AuthorityGuard>
```

</details>

---

#### 404. [`src/pages/WAS/requests/components/workspace-card.jsx:28`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/requests/components/workspace-card.jsx#L28)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/requests/components/workspace-card.jsx`
- **Line Number**: `28`
- **Button Label**: `Select`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Select" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Sparkles className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Sparkles className="size-4" />
  <span>Select</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    27 |                     <Link to={'/appsec/collections'}>
>   28 |                         <Button variant="primary" onClick={onClick}>
    29 |                             Select
    30 |                         </Button>
    31 |                     </Link>
```

</details>

---

#### 405. [`src/pages/WAS/scan-profile/scan-profile.jsx:349`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/scan-profile/scan-profile.jsx#L349)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/scan-profile/scan-profile.jsx`
- **Line Number**: `349`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   348 |                 {isEditing && (
>  349 |                   <Button
   350 |                     type="button"
   351 |                     variant="outline"
   352 |                     onClick={handleCancel}
```

</details>

---

#### 406. [`src/pages/WAS/vulnerabilities/components/bulk-update.jsx:273`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/vulnerabilities/components/bulk-update.jsx#L273)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `273`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   272 |           onConfirm={handleBulkDelete}
>  273 |           confirmButton={<Button variant="primary">Proceed</Button>}
   274 |           cancelButton={<Button variant="outline">Cancel</Button>}
   275 |         >
   276 |           <Trash2 size={14} />
```

</details>

---

#### 407. [`src/pages/WAS/vulnerabilities/components/bulk-update.jsx:274`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/vulnerabilities/components/bulk-update.jsx#L274)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `274`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   273 |           confirmButton={<Button variant="primary">Proceed</Button>}
>  274 |           cancelButton={<Button variant="outline">Cancel</Button>}
   275 |         >
   276 |           <Trash2 size={14} />
   277 |         </ButtonWithConfirm>
```

</details>

---

#### 408. [`src/pages/WAS/vulnerabilities/components/vulnerability-actions.jsx:56`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/vulnerabilities/components/vulnerability-actions.jsx#L56)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/WAS/vulnerabilities/components/vulnerability-actions.jsx`
- **Line Number**: `56`
- **Button Label**: `View Ticket`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "View Ticket" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>View Ticket</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    55 |         {vuln?.sentToVm ? (
>   56 |           <Button
    57 |             variant="ghost"
    58 |             onClick={() => window.open(`/vm/vulnerability-report?id=${vuln?.universalVulnId}&assessmentId=${vuln?.assessmentId}`, '_blank')}
    59 |             className="w-full justify-start px-2 py-1.5 h-auto font-normal text-[0.8125rem] rounded-md hover:bg-accent text-left bg-transparent"
```

</details>

---

### Pages: account

#### 409. [`src/pages/account/api-keys/components/api-integrations.jsx:425`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/api-integrations.jsx#L425)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/api-integrations.jsx`
- **Line Number**: `425`
- **Button Label**: `Add New`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Add New" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Add New</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   424 |           </div>
>  425 |           <Button>Add New</Button>
   426 |           <DataGridColumnVisibility
   427 |             table={table}
   428 |             trigger={
```

</details>

---

#### 410. [`src/pages/account/api-keys/components/create-api-key-modal.jsx:41`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/create-api-key-modal.jsx#L41)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/create-api-key-modal.jsx`
- **Line Number**: `41`
- **Button Label**: `Close`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Close" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Close</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    40 |     <div className="flex justify-end gap-3 w-full">
>   41 |       <Button onClick={handleClose}>Close</Button>
    42 |     </div>
    43 |   ) : (
    44 |     <div className="flex justify-end gap-3 w-full">
```

</details>

---

#### 411. [`src/pages/account/api-keys/components/create-api-key-modal.jsx:45`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/create-api-key-modal.jsx#L45)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/create-api-key-modal.jsx`
- **Line Number**: `45`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    44 |     <div className="flex justify-end gap-3 w-full">
>   45 |       <Button variant="outline" onClick={handleClose}>Cancel</Button>
    46 |       <Button onClick={handleCreate} disabled={isLoading}>
    47 |         {isLoading ? 'Creating...' : 'Create API Key'}
    48 |       </Button>
```

</details>

---

#### 412. [`src/pages/account/api-keys/components/create-api-key-modal.jsx:46`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/create-api-key-modal.jsx#L46)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/create-api-key-modal.jsx`
- **Line Number**: `46`
- **Button Label**: `Creating... / Create API Key`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Creating... / Create API Key" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Creating... / Create API Key</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    45 |       <Button variant="outline" onClick={handleClose}>Cancel</Button>
>   46 |       <Button onClick={handleCreate} disabled={isLoading}>
    47 |         {isLoading ? 'Creating...' : 'Create API Key'}
    48 |       </Button>
    49 |     </div>
```

</details>

---

#### 413. [`src/pages/account/api-keys/components/create-api-key-modal.jsx:66`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/create-api-key-modal.jsx#L66)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/create-api-key-modal.jsx`
- **Line Number**: `66`
- **Button Label**: `Copy`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Copy" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Copy</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    65 |             </div>
>   66 |             <Button onClick={() => { navigator.clipboard.writeText(createdKey); toast.success('Copied to clipboard'); }}>Copy</Button>
    67 |           </div>
    68 |         </div>
    69 |       ) : (
```

</details>

---

#### 414. [`src/pages/account/api-keys/components/web-hooks.jsx:72`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/web-hooks.jsx#L72)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/api-keys/components/web-hooks.jsx`
- **Line Number**: `72`
- **Button Label**: `Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    71 |         <div className="flex justify-end">
>   72 |           <Button>Save Changes</Button>
    73 |         </div>
    74 |       </CardContent>
    75 |     </Card>
```

</details>

---

#### 415. [`src/pages/account/configration/configigure/config.jsx:232`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/configration/configigure/config.jsx#L232)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/configration/configigure/config.jsx`
- **Line Number**: `232`
- **Button Label**: `Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   231 |                         <div className="px-8 py-6 bg-muted/20 border-t border-muted/50 flex flex-wrap gap-4 items-center">
>  232 |                             <Button
   233 |                                 onClick={handleSave}
   234 |                                 className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-semibold px-10 h-11 shadow-lg shadow-blue-500/20"
   235 |                             >
```

</details>

---

#### 416. [`src/pages/account/configration/configigure/config.jsx:238`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/configration/configigure/config.jsx#L238)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/configration/configigure/config.jsx`
- **Line Number**: `238`
- **Button Label**: `Send Test Email`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Send Test Email" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Send className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Send className="size-4" />
  <span>Send Test Email</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   237 |                             </Button>
>  238 |                             <Button
   239 |                                 variant="outline"
   240 |                                 onClick={handleTestEmail}
   241 |                                 className="h-11 px-8 font-semibold border-muted-foreground/20 hover:bg-background/60 backdrop-blur-sm transition-all shadow-sm active:scale-95"
```

</details>

---

#### 417. [`src/pages/account/home/company-profile/components/branding.jsx:269`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/company-profile/components/branding.jsx#L269)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/company-profile/components/branding.jsx`
- **Line Number**: `269`
- **Button Label**: `Saving / Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving / Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving / Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   268 |             <div className="flex justify-end">
>  269 |               <Button
   270 |                 onClick={handleSaveCompanyDetails}
   271 |                 disabled={isSavingCompanyDetails}
   272 |               >
```

</details>

---

#### 418. [`src/pages/account/home/settings-sidebar/components/actions/remove-profile-pic.jsx:66`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/actions/remove-profile-pic.jsx#L66)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/actions/remove-profile-pic.jsx`
- **Line Number**: `66`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    65 |           cancelButton={
>   66 |             <Button type="button" variant="outline">
    67 |               Cancel
    68 |             </Button>
    69 |           }
```

</details>

---

#### 419. [`src/pages/account/home/settings-sidebar/components/actions/remove-profile-pic.jsx:71`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/actions/remove-profile-pic.jsx#L71)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/actions/remove-profile-pic.jsx`
- **Line Number**: `71`
- **Button Label**: `Remove`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Remove" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Remove</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    70 |           confirmButton={
>   71 |             <Button type="button" variant="destructive">
    72 |               Remove
    73 |             </Button>
    74 |           }
```

</details>

---

#### 420. [`src/pages/account/home/settings-sidebar/components/advanced-settings-address.jsx:93`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/advanced-settings-address.jsx#L93)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/advanced-settings-address.jsx`
- **Line Number**: `93`
- **Button Label**: `Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    92 |         <div className="flex justify-end pt-2.5">
>   93 |           <Button
    94 |             onClick={() =>
    95 |               handleUpdate(
    96 |                 {
```

</details>

---

#### 421. [`src/pages/account/home/settings-sidebar/components/auth-single-sing-on.jsx:114`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/auth-single-sing-on.jsx#L114)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/auth-single-sing-on.jsx`
- **Line Number**: `114`
- **Button Label**: `Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   113 |             <div className="flex justify-end">
>  114 |               <Button>Save Changes</Button>
   115 |             </div>
   116 |           </div>
   117 |           <div className="border-b border-border"></div>
```

</details>

---

#### 422. [`src/pages/account/home/settings-sidebar/components/auth-single-sing-on.jsx:133`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/auth-single-sing-on.jsx#L133)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/auth-single-sing-on.jsx`
- **Line Number**: `133`
- **Button Label**: `Copy`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Copy" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Copy className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Copy className="size-4" />
  <span>Copy</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   132 | 
>  133 |                     <Button className="rounded-l-none border-l-0">Copy</Button>
   134 |                   </div>
   135 |                 </div>
   136 |               </div>
```

</details>

---

#### 423. [`src/pages/account/home/settings-sidebar/components/auth-social-sign-in.jsx:138`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/auth-social-sign-in.jsx#L138)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/home/settings-sidebar/components/auth-social-sign-in.jsx`
- **Line Number**: `138`
- **Button Label**: `Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   137 |         <div className="flex justify-end">
>  138 |           <Button>Save Changes</Button>
   139 |         </div>
   140 |       </CardContent>
   141 |     </Card>
```

</details>

---

#### 424. [`src/pages/account/integration/components/actions/confirm-adapter-installation-btn.jsx:56`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/actions/confirm-adapter-installation-btn.jsx#L56)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/actions/confirm-adapter-installation-btn.jsx`
- **Line Number**: `56`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    55 |       confirmButton={
>   56 |         <Button variant="primary" disabled={isIntegratingAdptr}>
    57 |           Proceed
    58 |         </Button>
    59 |       }
```

</details>

---

#### 425. [`src/pages/account/integration/components/actions/confirm-adapter-installation-btn.jsx:60`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/actions/confirm-adapter-installation-btn.jsx#L60)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/actions/confirm-adapter-installation-btn.jsx`
- **Line Number**: `60`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    59 |       }
>   60 |       cancelButton={<Button variant="outline">Cancel</Button>}
    61 |     >
    62 |       <Download /> Install
    63 |     </ButtonWithConfirm>
```

</details>

---

#### 426. [`src/pages/account/integration/components/cards/actions/delete-adapter.jsx:37`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/cards/actions/delete-adapter.jsx#L37)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/cards/actions/delete-adapter.jsx`
- **Line Number**: `37`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    36 |       onConfirm={() => deleteActvAdapter()}
>   37 |       confirmButton={<Button variant="primary">Proceed</Button>}
    38 |       cancelButton={<Button variant="outline">Cancel</Button>}
    39 |       dialog={
    40 |         <div className=" flex flex-col items-center">
```

</details>

---

#### 427. [`src/pages/account/integration/components/cards/actions/delete-adapter.jsx:38`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/cards/actions/delete-adapter.jsx#L38)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/cards/actions/delete-adapter.jsx`
- **Line Number**: `38`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    37 |       confirmButton={<Button variant="primary">Proceed</Button>}
>   38 |       cancelButton={<Button variant="outline">Cancel</Button>}
    39 |       dialog={
    40 |         <div className=" flex flex-col items-center">
    41 |           <p>Are you sure want to delete this adapter?</p>
```

</details>

---

#### 428. [`src/pages/account/integration/components/cards/adapter-info-card.jsx:184`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/cards/adapter-info-card.jsx#L184)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/cards/adapter-info-card.jsx`
- **Line Number**: `184`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   183 |               onConfirm={() => deleteActvAdapter()}
>  184 |               confirmButton={<Button variant="primary">Proceed</Button>}
   185 |               cancelButton={<Button variant="outline">Cancel</Button>}
   186 |             >
   187 |               <Trash /> Delete
```

</details>

---

#### 429. [`src/pages/account/integration/components/cards/adapter-info-card.jsx:185`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/cards/adapter-info-card.jsx#L185)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/cards/adapter-info-card.jsx`
- **Line Number**: `185`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   184 |               confirmButton={<Button variant="primary">Proceed</Button>}
>  185 |               cancelButton={<Button variant="outline">Cancel</Button>}
   186 |             >
   187 |               <Trash /> Delete
   188 |             </ButtonWithConfirm>
```

</details>

---

#### 430. [`src/pages/account/integration/components/lists/adapters-list.jsx:20`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/lists/adapters-list.jsx#L20)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/lists/adapters-list.jsx`
- **Line Number**: `20`
- **Button Label**: `Install`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Install" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Download className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Download className="size-4" />
  <span>Install</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    19 | 
>   20 |   const adapters = newAdapters.map(a => ({ ...a, preinstall: <Button variant="outline" onClick={() => open_adapter(a)}>Install</Button> }));
    21 | 
    22 |   const filteredAdapters = useMemo(() => {
    23 |     const q = searchQuery.toLowerCase();
```

</details>

---

#### 431. [`src/pages/account/integration/components/modals/qradar.modal.jsx:85`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/modals/qradar.modal.jsx#L85)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/modals/qradar.modal.jsx`
- **Line Number**: `85`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    84 |         <div className="flex gap-2 justify-end">
>   85 |           <Button variant="outline" onClick={closeModal} disabled={isLoading}>
    86 |             Cancel
    87 |           </Button>
    88 |           <Button
```

</details>

---

#### 432. [`src/pages/account/integration/components/modals/qradar.modal.jsx:88`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/modals/qradar.modal.jsx#L88)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/integration/components/modals/qradar.modal.jsx`
- **Line Number**: `88`
- **Button Label**: `Installing... / Install`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Installing... / Install" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Download className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Download className="size-4" />
  <span>Installing... / Install</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    87 |           </Button>
>   88 |           <Button
    89 |             variant="outline"
    90 |             disabled={isLoading}
    91 |             onClick={handleSubmit(onSubmit)}
```

</details>

---

#### 433. [`src/pages/account/mcp-access/tabs/mcp-sessions-tab/mcp-sessions-tab.jsx:255`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/mcp-access/tabs/mcp-sessions-tab/mcp-sessions-tab.jsx#L255)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/mcp-access/tabs/mcp-sessions-tab/mcp-sessions-tab.jsx`
- **Line Number**: `255`
- **Button Label**: `View Setup Instructions`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "View Setup Instructions" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>View Setup Instructions</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   254 |           engage={
>  255 |             <Button
   256 |               size="sm"
   257 |               onClick={onSwitchToSetup}
   258 |               className="cursor-pointer"
```

</details>

---

#### 434. [`src/pages/account/members/department-details/components/actions/delete-department.jsx:49`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/department-details/components/actions/delete-department.jsx#L49)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/department-details/components/actions/delete-department.jsx`
- **Line Number**: `49`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    48 |       confirmButton={
>   49 |         <Button variant="destructive" disabled={isDeleting}>
    50 |           Delete
    51 |         </Button>
    52 |       }
```

</details>

---

#### 435. [`src/pages/account/members/department-details/components/actions/delete-department.jsx:53`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/department-details/components/actions/delete-department.jsx#L53)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/department-details/components/actions/delete-department.jsx`
- **Line Number**: `53`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    52 |       }
>   53 |       cancelButton={<Button variant="outline">Cancel</Button>}
    54 |     >
    55 |       <div className="w-full flex items-center justify-start gap-2">
    56 |         <span className="font-normal">Delete</span>
```

</details>

---

#### 436. [`src/pages/account/members/department-details/components/modals/update-department-model.jsx:106`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/department-details/components/modals/update-department-model.jsx#L106)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/department-details/components/modals/update-department-model.jsx`
- **Line Number**: `106`
- **Button Label**: `Updating... / Update Teams`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Updating... / Update Teams" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Updating... / Update Teams</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   105 |         <div className="w-full flex items-center justify-end mt-4">
>  106 |           <Button onClick={handleUpdateTeams} disabled={isUpdating}>
   107 |             {isUpdating ? 'Updating...' : 'Update Teams'}
   108 |           </Button>
   109 |         </div>
```

</details>

---

#### 437. [`src/pages/account/members/department-details/components/tables/department-members-table.jsx:122`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/department-details/components/tables/department-members-table.jsx#L122)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/department-details/components/tables/department-members-table.jsx`
- **Line Number**: `122`
- **Button Label**: `Remove`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Remove" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Remove</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   121 |                     confirmOnInput={'shoaibwani'}
>  122 |                     confirmButton={<Button variant="destructive">Remove</Button>}
   123 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   124 |                   >
   125 |                     Remove
```

</details>

---

#### 438. [`src/pages/account/members/department-details/components/tables/department-members-table.jsx:123`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/department-details/components/tables/department-members-table.jsx#L123)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/department-details/components/tables/department-members-table.jsx`
- **Line Number**: `123`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   122 |                     confirmButton={<Button variant="destructive">Remove</Button>}
>  123 |                     cancelButton={<Button variant="outline">Cancel</Button>}
   124 |                   >
   125 |                     Remove
   126 |                   </ButtonWithConfirm>
```

</details>

---

#### 439. [`src/pages/account/members/import-members/components/import.jsx:69`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/import-members/components/import.jsx#L69)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/import-members/components/import.jsx`
- **Line Number**: `69`
- **Button Label**: `Select CSV File`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Select CSV File" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Select CSV File</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    68 |           <div className="flex gap-2.5">
>   69 |             <Button>Select CSV File</Button>
    70 |             <Button variant="ghost">Choose File</Button>
    71 |           </div>
    72 |           <p className="text-secondary-foreground text-sm">
```

</details>

---

#### 440. [`src/pages/account/members/import-members/components/import.jsx:70`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/import-members/components/import.jsx#L70)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/import-members/components/import.jsx`
- **Line Number**: `70`
- **Button Label**: `Choose File`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon & Invalid Ghost Variant**: This button represents an actionable operation ("Choose File") but is rendered with `variant="ghost"` instead of `variant="primary"`, and is missing a contextually relevant icon.

**Suggested Change**:

Update the Button to use `variant="primary"` and include <Upload className="size-4" /> from `lucide-react` alongside the label:
```jsx
<Button variant="primary" ...>
  <Upload className="size-4" />
  <span>Choose File</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    69 |             <Button>Select CSV File</Button>
>   70 |             <Button variant="ghost">Choose File</Button>
    71 |           </div>
    72 |           <p className="text-secondary-foreground text-sm">
    73 |             Use the 'Choose file' button to locate and upload the CSV file that
```

</details>

---

#### 441. [`src/pages/account/members/members/components/tables/members.jsx:118`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/members/components/tables/members.jsx#L118)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/members/components/tables/members.jsx`
- **Line Number**: `118`
- **Button Label**: `Lock`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Lock" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Lock className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Lock className="size-4" />
  <span>Lock</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   117 |                 confirmButton={
>  118 |                   <Button
   119 |                     variant="destructive"
   120 |                     disabled={isUnLocking || isLocking}
   121 |                   >
```

</details>

---

#### 442. [`src/pages/account/members/members/components/tables/members.jsx:125`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/members/components/tables/members.jsx#L125)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/members/components/tables/members.jsx`
- **Line Number**: `125`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   124 |                 }
>  125 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   126 |                 onConfirm={handleLockMember}
   127 |               >
   128 |                 Lock Member
```

</details>

---

#### 443. [`src/pages/account/members/members/components/tables/members.jsx:137`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/members/components/tables/members.jsx#L137)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/members/components/tables/members.jsx`
- **Line Number**: `137`
- **Button Label**: `Unlock`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Unlock" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Lock className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Lock className="size-4" />
  <span>Unlock</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   136 |                 confirmButton={
>  137 |                   <Button variant="primary" disabled={isUnLocking || isLocking}>
   138 |                     Unlock
   139 |                   </Button>
   140 |                 }
```

</details>

---

#### 444. [`src/pages/account/members/members/components/tables/members.jsx:141`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/members/components/tables/members.jsx#L141)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/members/components/tables/members.jsx`
- **Line Number**: `141`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   140 |                 }
>  141 |                 cancelButton={<Button variant="outline">Cancel</Button>}
   142 |                 onConfirm={handleUnlockMember}
   143 |               >
   144 |                 Unlock Member
```

</details>

---

#### 445. [`src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx:562`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx#L562)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx`
- **Line Number**: `562`
- **Button Label**: `Update`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Update" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Update</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   561 |                     {!isMember && (
>  562 |                       <Button
   563 |                         className="h-8"
   564 |                         variant="outline"
   565 |                         disabled={isUpdatingRole}
```

</details>

---

#### 446. [`src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx:591`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx#L591)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx`
- **Line Number**: `591`
- **Button Label**: `Update`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Update" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Update</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   590 |                     {!isMember && (
>  591 |                       <Button
   592 |                         className="h-10"
   593 |                         variant="outline"
   594 |                         disabled={isUpdatingTeam}
```

</details>

---

#### 447. [`src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx:629`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx#L629)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx`
- **Line Number**: `629`
- **Button Label**: `Update`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Update" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <UserPlus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <UserPlus className="size-4" />
  <span>Update</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   628 |                     {!isMember && (
>  629 |                       <Button
   630 |                         className="h-10"
   631 |                         variant="outline"
   632 |                         disabled={isAddingBulkCollaborators}
```

</details>

---

#### 448. [`src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx:699`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx#L699)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx`
- **Line Number**: `699`
- **Button Label**: `Close`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Close" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Close</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   698 |           <DialogFooter>
>  699 |             <Button variant="outline" onClick={handleClosePasswordModal}>
   700 |               Close
   701 |             </Button>
   702 |           </DialogFooter>
```

</details>

---

#### 449. [`src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx:740`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx#L740)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/permissions-toggle/components/permissions-toggle.jsx`
- **Line Number**: `740`
- **Button Label**: `Enable / Disable`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Enable / Disable" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Power className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Power className="size-4" />
  <span>Enable / Disable</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   739 |         confirmButton={
>  740 |           <Button
   741 |             variant={productToToggle?.isEnabling ? 'primary' : 'destructive'}
   742 |           >
   743 |             {productToToggle?.isEnabling ? 'Enable' : 'Disable'}
```

</details>

---

#### 450. [`src/pages/account/members/roles/account-basic-page.jsx:40`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/roles/account-basic-page.jsx#L40)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/roles/account-basic-page.jsx`
- **Line Number**: `40`
- **Button Label**: `New Role`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "New Role" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>New Role</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    39 |               trigger={
>   40 |                 <Button variant="outline">
    41 |                   New Role
    42 |                 </Button>
    43 |               }
```

</details>

---

#### 451. [`src/pages/account/members/roles/components/new-role-modal.jsx:114`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/roles/components/new-role-modal.jsx#L114)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/roles/components/new-role-modal.jsx`
- **Line Number**: `114`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   113 |                     )}
>  114 |                     <Button
   115 |                         variant="outline"
   116 |                         onClick={() => setOpen(false)}
   117 |                         className="border-none hover:bg-accent"
```

</details>

---

#### 452. [`src/pages/account/members/roles/components/new-role-modal.jsx:121`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/roles/components/new-role-modal.jsx#L121)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/roles/components/new-role-modal.jsx`
- **Line Number**: `121`
- **Button Label**: `Create Role`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Create Role" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Create Role</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   120 |                     </Button>
>  121 |                     <Button
   122 |                         onClick={() => {
   123 |                             setOpen(false);
   124 |                         }}
```

</details>

---

#### 453. [`src/pages/account/members/team-details/components/actions/delete-team.jsx:42`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/actions/delete-team.jsx#L42)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/actions/delete-team.jsx`
- **Line Number**: `42`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    41 |       confirmButton={
>   42 |         <Button variant="destructive" disabled={isDeleting}>
    43 |           Delete
    44 |         </Button>
    45 |       }
```

</details>

---

#### 454. [`src/pages/account/members/team-details/components/actions/delete-team.jsx:46`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/actions/delete-team.jsx#L46)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/actions/delete-team.jsx`
- **Line Number**: `46`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    45 |       }
>   46 |       cancelButton={<Button variant="outline">Cancel</Button>}
    47 |     >
    48 |       <div className="w-full flex items-center justify-start gap-2">
    49 |         <span className="font-normal">Delete</span>
```

</details>

---

#### 455. [`src/pages/account/members/team-details/components/cards/team-info-card.jsx:145`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/cards/team-info-card.jsx#L145)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/cards/team-info-card.jsx`
- **Line Number**: `145`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save edit") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   144 |                     <div className="flex gap-2 justify-center">
>  145 |                       <Button variant="ghost" onClick={saveEdit} disabled={isUpdating}>
   146 |                         <Check size={16} className="text-green-600" />
   147 |                       </Button>
   148 |                       <Button variant="ghost" onClick={cancelEdit}>
```

</details>

---

#### 456. [`src/pages/account/members/team-details/components/cards/team-info-card.jsx:188`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/cards/team-info-card.jsx#L188)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/cards/team-info-card.jsx`
- **Line Number**: `188`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save edit") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   187 |                     <div className="flex gap-2 justify-center">
>  188 |                       <Button variant="ghost" onClick={saveEdit} disabled={isUpdating}>
   189 |                         <Check size={16} className="text-green-600" />
   190 |                       </Button>
   191 |                       <Button variant="ghost" onClick={cancelEdit}>
```

</details>

---

#### 457. [`src/pages/account/members/team-details/components/cards/team-info-card.jsx:235`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/cards/team-info-card.jsx#L235)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/cards/team-info-card.jsx`
- **Line Number**: `235`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save edit") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   234 |                     <div className="flex gap-2 justify-center">
>  235 |                       <Button variant="ghost" onClick={saveEdit} disabled={isUpdating}>
   236 |                         <Check size={16} className="text-green-600" />
   237 |                       </Button>
   238 |                       <Button variant="ghost" onClick={cancelEdit}>
```

</details>

---

#### 458. [`src/pages/account/members/team-details/components/cards/team-info-card.jsx:293`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/cards/team-info-card.jsx#L293)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/cards/team-info-card.jsx`
- **Line Number**: `293`
- **Button Label**: `(No text / Icon mode)`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("save edit") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   292 |                     <div className="flex gap-2 justify-center">
>  293 |                       <Button variant="ghost" onClick={saveEdit} disabled={isUpdating}>
   294 |                         <Check size={16} className="text-green-600" />
   295 |                       </Button>
   296 |                       <Button variant="ghost" onClick={cancelEdit}>
```

</details>

---

#### 459. [`src/pages/account/members/team-details/components/modals/update-team-model.jsx:178`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/modals/update-team-model.jsx#L178)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/modals/update-team-model.jsx`
- **Line Number**: `178`
- **Button Label**: `Updating... / Update Members`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Updating... / Update Members" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Updating... / Update Members</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   177 |         <div className="w-full flex items-center justify-end mt-4">
>  178 |           <Button onClick={handleUpdateMembers} disabled={isUpdating}>
   179 |             {isUpdating ? "Updating..." : "Update Members"}
   180 |           </Button>
   181 |         </div>
```

</details>

---

#### 460. [`src/pages/account/members/team-details/components/tables/team-members-table.jsx:178`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/tables/team-members-table.jsx#L178)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/account/members/team-details/components/tables/team-members-table.jsx`
- **Line Number**: `178`
- **Button Label**: `Remove`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Remove" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Remove</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   177 |                 confirmButton={
>  178 |                   <Button variant="destructive" disabled={isRemoving}>
   179 |                     Remove
   180 |                   </Button>
   181 |                 }
```

</details>

---

### Pages: auto-pt

#### 461. [`src/pages/auto-pt/agents/components/agent-action-cell.jsx:48`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/agents/components/agent-action-cell.jsx#L48)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/agents/components/agent-action-cell.jsx`
- **Line Number**: `48`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    47 |             confirmButton={
>   48 |               <Button variant="destructive" disabled={isDeleting}>
    49 |                 Delete
    50 |               </Button>
    51 |             }
```

</details>

---

#### 462. [`src/pages/auto-pt/agents/components/agent-action-cell.jsx:52`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/agents/components/agent-action-cell.jsx#L52)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/agents/components/agent-action-cell.jsx`
- **Line Number**: `52`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    51 |             }
>   52 |             cancelButton={<Button variant="outline">Cancel</Button>}
    53 |             className="w-full justify-start !font-normal cursor-pointer !text-inherit px-2 py-1.5 text-sm h-8"
    54 |           >
    55 |             <span className="text-destructive">Delete</span>
```

</details>

---

#### 463. [`src/pages/auto-pt/assets/components/asset-group-asset-picker.jsx:60`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-asset-picker.jsx#L60)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-asset-picker.jsx`
- **Line Number**: `60`
- **Button Label**: `Clear Selection`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Clear Selection" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RotateCcw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RotateCcw className="size-4" />
  <span>Clear Selection</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    59 |         </p>
>   60 |         <Button
    61 |           type="button"
    62 |           variant="outline"
    63 |           disabled={disabled || !selectedCount}
```

</details>

---

#### 464. [`src/pages/auto-pt/assets/components/asset-group-asset-picker.jsx:74`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-asset-picker.jsx#L74)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-asset-picker.jsx`
- **Line Number**: `74`
- **Button Label**: `Retry`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Retry" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Retry</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    73 |           </p>
>   74 |           <Button type="button" variant="outline" onClick={refetch}>
    75 |             Retry
    76 |           </Button>
    77 |         </div>
```

</details>

---

#### 465. [`src/pages/auto-pt/assets/components/asset-group-dialog.jsx:102`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx#L102)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx`
- **Line Number**: `102`
- **Button Label**: `Hide Asset Selection / Add Assets (optional)`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Hide Asset Selection / Add Assets (optional)" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Hide Asset Selection / Add Assets (optional)</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   101 |         <section className="space-y-3" aria-label="Initial group assets">
>  102 |           <Button
   103 |             type="button"
   104 |             variant="outline"
   105 |             disabled={busy}
```

</details>

---

#### 466. [`src/pages/auto-pt/assets/components/asset-group-dialog.jsx:125`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx#L125)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx`
- **Line Number**: `125`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   124 |       <div className="flex justify-end gap-2">
>  125 |         <Button
   126 |           type="button"
   127 |           variant="outline"
   128 |           onClick={onClose}
```

</details>

---

#### 467. [`src/pages/auto-pt/assets/components/asset-group-dialog.jsx:133`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx#L133)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx`
- **Line Number**: `133`
- **Button Label**: `Saving… / Save Group`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving… / Save Group" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving… / Save Group</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   132 |         </Button>
>  133 |         <Button type="submit" form="asset-group-form" disabled={busy}>
   134 |           {busy ? 'Saving…' : 'Save Group'}
   135 |         </Button>
   136 |       </div>
```

</details>

---

#### 468. [`src/pages/auto-pt/assets/components/asset-group-dialog.jsx:165`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx#L165)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx`
- **Line Number**: `165`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   164 |       <div className="flex justify-end gap-2">
>  165 |         <Button variant="outline" onClick={onClose} disabled={isLoading}>
   166 |           Cancel
   167 |         </Button>
   168 |         <Button
```

</details>

---

#### 469. [`src/pages/auto-pt/assets/components/asset-group-dialog.jsx:168`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx#L168)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx`
- **Line Number**: `168`
- **Button Label**: `Deleting… / Delete Group`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Deleting… / Delete Group" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Deleting… / Delete Group</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   167 |         </Button>
>  168 |         <Button
   169 |           variant="destructive"
   170 |           onClick={handleDelete}
   171 |           disabled={isLoading}
```

</details>

---

#### 470. [`src/pages/auto-pt/assets/components/asset-group-dialog.jsx:218`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx#L218)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-dialog.jsx`
- **Line Number**: `218`
- **Button Label**: `Retry`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Retry" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Retry</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   217 |               <p>{error?.data?.message || 'Unable to load this group.'}</p>
>  218 |               <Button variant="outline" onClick={refetch}>
   219 |                 Retry
   220 |               </Button>
   221 |             </div>
```

</details>

---

#### 471. [`src/pages/auto-pt/assets/components/asset-group-members.jsx:154`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-members.jsx#L154)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-members.jsx`
- **Line Number**: `154`
- **Button Label**: `Back to Members / Add Assets`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Back to Members / Add Assets" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <UserPlus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <UserPlus className="size-4" />
  <span>Back to Members / Add Assets</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   153 |           <div className="flex gap-2">
>  154 |             <Button variant="outline" disabled={busy} onClick={toggleMode}>
   155 |               {adding ? 'Back to Members' : 'Add Assets'}
   156 |             </Button>
   157 |             {adding ? (
```

</details>

---

#### 472. [`src/pages/auto-pt/assets/components/asset-group-members.jsx:158`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-members.jsx#L158)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-members.jsx`
- **Line Number**: `158`
- **Button Label**: `Adding… /`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Adding… /" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <UserPlus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <UserPlus className="size-4" />
  <span>Adding… /</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   157 |             {adding ? (
>  158 |               <Button disabled={busy || !assetIds.length} onClick={saveMembers}>
   159 |                 {busy ? 'Adding…' : `Add Selected (${assetIds.length})`}
   160 |               </Button>
   161 |             ) : (
```

</details>

---

#### 473. [`src/pages/auto-pt/assets/components/asset-group-members.jsx:193`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-members.jsx#L193)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/assets/components/asset-group-members.jsx`
- **Line Number**: `193`
- **Button Label**: `Retry`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Retry" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Retry</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   192 |           </p>
>  193 |           <Button variant="outline" onClick={query.refetch}>
   194 |             Retry
   195 |           </Button>
   196 |         </div>
```

</details>

---

#### 474. [`src/pages/auto-pt/code-security/settings.jsx:379`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/code-security/settings.jsx#L379)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/code-security/settings.jsx`
- **Line Number**: `379`
- **Button Label**: `Discard Changes`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Discard Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Discard Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   378 |         <div className="flex justify-end gap-2">
>  379 |           <Button
   380 |             type="button"
   381 |             variant="outline"
   382 |             disabled={isLoading || !form.formState.isDirty}
```

</details>

---

#### 475. [`src/pages/auto-pt/code-security/settings.jsx:389`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/code-security/settings.jsx#L389)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/code-security/settings.jsx`
- **Line Number**: `389`
- **Button Label**: `Saving… / Save Settings`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving… / Save Settings" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving… / Save Settings</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   388 |           </Button>
>  389 |           <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
   390 |             {isLoading ? 'Saving…' : 'Save Settings'}
   391 |           </Button>
   392 |         </div>
```

</details>

---

#### 476. [`src/pages/auto-pt/code-security/settings.jsx:420`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/code-security/settings.jsx#L420)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/code-security/settings.jsx`
- **Line Number**: `420`
- **Button Label**: `Retry`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Retry" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Retry</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   419 |             </p>
>  420 |             <Button variant="outline" onClick={refetch}>
   421 |               Retry
   422 |             </Button>
   423 |           </div>
```

</details>

---

#### 477. [`src/pages/auto-pt/pentest/components/dropdown-actions.jsx:122`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest/components/dropdown-actions.jsx#L122)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest/components/dropdown-actions.jsx`
- **Line Number**: `122`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   121 |                   confirmButton={
>  122 |                     <Button variant="destructive" disabled={isDeleting}>
   123 |                       Delete
   124 |                     </Button>
   125 |                   }
```

</details>

---

#### 478. [`src/pages/auto-pt/pentest/components/dropdown-actions.jsx:126`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest/components/dropdown-actions.jsx#L126)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest/components/dropdown-actions.jsx`
- **Line Number**: `126`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   125 |                   }
>  126 |                   cancelButton={<Button variant="outline">Cancel</Button>}
   127 |                   variant="ghost"
   128 |                   className="w-full justify-start !font-normal !bg-transparent hover:!bg-red-200/20 px-2.5 py-1.5 text-sm h-8 cursor-pointer"
   129 |                 >
```

</details>

---

#### 479. [`src/pages/auto-pt/pentest-create/components/step-review-create.jsx:638`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-create/components/step-review-create.jsx#L638)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-create/components/step-review-create.jsx`
- **Line Number**: `638`
- **Button Label**: `Back`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Back" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowLeft className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowLeft className="size-4" />
  <span>Back</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   637 |       <div className="flex items-center justify-between pt-4">
>  638 |         <Button
   639 |           type="button"
   640 |           variant="outline"
   641 |           onClick={onBack}
```

</details>

---

#### 480. [`src/pages/auto-pt/pentest-create/components/stepper-actions.jsx:32`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-create/components/stepper-actions.jsx#L32)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-create/components/stepper-actions.jsx`
- **Line Number**: `32`
- **Button Label**: `Cancel`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    31 |             </Button>
>   32 |             <Button
    33 |               type="button"
    34 |               variant="ghost"
    35 |               onClick={onCancel}
```

</details>

---

#### 481. [`src/pages/auto-pt/pentest-detail/components/actions/delete-pentest-action.jsx:52`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/actions/delete-pentest-action.jsx#L52)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/actions/delete-pentest-action.jsx`
- **Line Number**: `52`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    51 |             confirmButton={
>   52 |               <Button variant="destructive" disabled={isDeleting}>
    53 |                 Delete
    54 |               </Button>
    55 |             }
```

</details>

---

#### 482. [`src/pages/auto-pt/pentest-detail/components/actions/delete-pentest-action.jsx:56`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/actions/delete-pentest-action.jsx#L56)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/actions/delete-pentest-action.jsx`
- **Line Number**: `56`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    55 |             }
>   56 |             cancelButton={<Button variant="outline">Cancel</Button>}
    57 |             variant="ghost"
    58 |             className="w-full justify-start !font-normal !bg-transparent hover:!bg-red-200/20 px-2 py-1.5 text-sm h-8 cursor-pointer"
    59 |           >
```

</details>

---

#### 483. [`src/pages/auto-pt/pentest-detail/components/actions/edit-details-modal.jsx:62`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/actions/edit-details-modal.jsx#L62)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/actions/edit-details-modal.jsx`
- **Line Number**: `62`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    61 |         <div className="flex items-center justify-end gap-2">
>   62 |           <Button
    63 |             variant="outline"
    64 |             onClick={() => setOpen(false)}
    65 |           >
```

</details>

---

#### 484. [`src/pages/auto-pt/pentest-detail/components/actions/edit-details-modal.jsx:68`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/actions/edit-details-modal.jsx#L68)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/actions/edit-details-modal.jsx`
- **Line Number**: `68`
- **Button Label**: `Saving... / Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    67 |           </Button>
>   68 |           <Button
    69 |             onClick={handleSaveDetails}
    70 |             disabled={isUpdating}
    71 |           >
```

</details>

---

#### 485. [`src/pages/auto-pt/pentest-detail/components/instant-scan-modal/index.jsx:138`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/instant-scan-modal/index.jsx#L138)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/instant-scan-modal/index.jsx`
- **Line Number**: `138`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   137 |                 <DialogFooter className="flex-shrink-0 mt-2">
>  138 |                     <Button
   139 |                         variant="outline"
   140 |                         onClick={() => onOpenChange(false)}
   141 |                         disabled={isLaunching}
```

</details>

---

#### 486. [`src/pages/auto-pt/pentest-detail/components/request-comparison.jsx:297`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/request-comparison.jsx#L297)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/request-comparison.jsx`
- **Line Number**: `297`
- **Button Label**: `Close`
- **Current Variant**: `secondary`
- **Issue**: **Missing Icon**: The button with label "Close" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Close</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   296 |           </div>
>  297 |           <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto px-10 h-10 font-bold uppercase tracking-wider text-xs">
   298 |             Close
   299 |           </Button>
   300 |         </div>
```

</details>

---

#### 487. [`src/pages/auto-pt/pentest-detail/components/scanner-config-modal/auth-script-editor-modal.jsx:81`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/scanner-config-modal/auth-script-editor-modal.jsx#L81)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/scanner-config-modal/auth-script-editor-modal.jsx`
- **Line Number**: `81`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    80 |                 <DialogFooter className="p-6 pt-2 bg-muted/20 border-t">
>   81 |                     <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
    82 |                         Cancel
    83 |                     </Button>
    84 |                     <Button
```

</details>

---

#### 488. [`src/pages/auto-pt/pentest-detail/components/scanner-config-modal/auth-script-editor-modal.jsx:84`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/scanner-config-modal/auth-script-editor-modal.jsx#L84)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/scanner-config-modal/auth-script-editor-modal.jsx`
- **Line Number**: `84`
- **Button Label**: `Saving... / Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    83 |                     </Button>
>   84 |                     <Button
    85 |                         variant="primary"
    86 |                         onClick={handleSave}
    87 |                         disabled={isUpdating || isFetching}
```

</details>

---

#### 489. [`src/pages/auto-pt/pentest-detail/components/scanner-config-modal/index.jsx:164`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/scanner-config-modal/index.jsx#L164)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/scanner-config-modal/index.jsx`
- **Line Number**: `164`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   163 |                 <DialogFooter className="flex-shrink-0 flex justify-between sm:justify-between">
>  164 |                     <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
   165 |                         Cancel
   166 |                     </Button>
   167 |                     <div className="flex gap-2">
```

</details>

---

#### 490. [`src/pages/auto-pt/pentest-detail/components/scanner-config-modal/index.jsx:168`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/scanner-config-modal/index.jsx#L168)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/scanner-config-modal/index.jsx`
- **Line Number**: `168`
- **Button Label**: `Saving... / Save & Deploy`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save & Deploy" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save & Deploy</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   167 |                     <div className="flex gap-2">
>  168 |                         <Button
   169 |                             variant="primary"
   170 |                             onClick={() => handleSave(false)}
   171 |                             disabled={isUpdating || !isFormValid}
```

</details>

---

#### 491. [`src/pages/auto-pt/pentest-detail/components/scanner-config-modal/scanner-settings-tab.jsx:113`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/scanner-config-modal/scanner-settings-tab.jsx#L113)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/scanner-config-modal/scanner-settings-tab.jsx`
- **Line Number**: `113`
- **Button Label**: `Change`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "Change" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Change</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   112 |                         </div>
>  113 |                         <Button
   114 |                             variant="ghost"
   115 |                             size="sm"
   116 |                             onClick={() => setShowFileUpload(true)}
```

</details>

---

#### 492. [`src/pages/auto-pt/pentest-detail/components/tabs/scan-history.jsx:468`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/scan-history.jsx#L468)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/scan-history.jsx`
- **Line Number**: `468`
- **Button Label**: `Go to Scan Settings`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Go to Scan Settings" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Go to Scan Settings</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   467 |           <AuthorityGuard forbidRoles={['Auditor']}>
>  468 |             <Button
   469 |               onClick={() => {
   470 |                 setSearchParams((prev) => {
   471 |                   const next = new URLSearchParams(prev);
```

</details>

---

#### 493. [`src/pages/auto-pt/pentest-detail/components/tabs/scan-settings.jsx:164`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/scan-settings.jsx#L164)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/scan-settings.jsx`
- **Line Number**: `164`
- **Button Label**: `Once`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Once" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Calendar className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Calendar className="size-4" />
  <span>Once</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   163 |                         <div className="grid grid-cols-3 gap-2">
>  164 |                             <Button
   165 |                                 variant={frequency === 'Once' ? 'secondary' : 'outline'}
   166 |                                 onClick={() => setFrequency('Once')}
   167 |                             >
```

</details>

---

#### 494. [`src/pages/auto-pt/pentest-detail/components/tabs/scan-settings.jsx:170`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/scan-settings.jsx#L170)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/scan-settings.jsx`
- **Line Number**: `170`
- **Button Label**: `Daily`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Daily" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Calendar className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Calendar className="size-4" />
  <span>Daily</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   169 |                             </Button>
>  170 |                             <Button
   171 |                                 variant={frequency === 'Daily' ? 'secondary' : 'outline'}
   172 |                                 onClick={() => setFrequency('Daily')}
   173 |                             >
```

</details>

---

#### 495. [`src/pages/auto-pt/pentest-detail/components/tabs/scan-settings.jsx:176`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/scan-settings.jsx#L176)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/scan-settings.jsx`
- **Line Number**: `176`
- **Button Label**: `Weekly`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Weekly" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Calendar className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Calendar className="size-4" />
  <span>Weekly</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   175 |                             </Button>
>  176 |                             <Button
   177 |                                 variant={frequency === 'Weekly' ? 'secondary' : 'outline'}
   178 |                                 onClick={() => setFrequency('Weekly')}
   179 |                             >
```

</details>

---

#### 496. [`src/pages/auto-pt/pentest-detail/components/tabs/threat-actions.jsx:59`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/threat-actions.jsx#L59)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/threat-actions.jsx`
- **Line Number**: `59`
- **Button Label**: `View Ticket`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "View Ticket" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>View Ticket</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    58 |         {vuln?.sentToVm ? (
>   59 |           <Button
    60 |             variant="ghost"
    61 |             onClick={() => window.open(`/vm/vulnerability-report?id=${vuln?.universalVulnId}&assessmentId=${vuln?.assessmentId}`, '_blank')}
    62 |             className="w-full justify-start px-2 py-1.5 h-auto font-normal text-[0.8125rem] rounded-md hover:bg-accent text-left bg-transparent"
```

</details>

---

#### 497. [`src/pages/auto-pt/pentest-detail/components/tabs/threats.jsx:284`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/threats.jsx#L284)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/tabs/threats.jsx`
- **Line Number**: `284`
- **Button Label**: `Go to Scan Settings`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Go to Scan Settings" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Go to Scan Settings</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   283 |           <AuthorityGuard forbidRoles={['Auditor']}>
>  284 |             <Button
   285 |               onClick={() => {
   286 |                 navigate('?tab=settings');
   287 |               }}
```

</details>

---

#### 498. [`src/pages/auto-pt/pentest-detail/components/web-app-components/authentication.jsx:137`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/web-app-components/authentication.jsx#L137)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/pentest-detail/components/web-app-components/authentication.jsx`
- **Line Number**: `137`
- **Button Label**: `Upload again`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Upload again" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Upload className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Upload className="size-4" />
  <span>Upload again</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   136 |             </div>
>  137 |             <Button
   138 |               variant="outline"
   139 |               size="sm"
   140 |               onClick={() => setShowFileUploadComponent(true)}
```

</details>

---

#### 499. [`src/pages/auto-pt/vulnerabilities/components/bulk-update.jsx:273`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/vulnerabilities/components/bulk-update.jsx#L273)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `273`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   272 |           onConfirm={handleBulkDelete}
>  273 |           confirmButton={<Button variant="primary">Proceed</Button>}
   274 |           cancelButton={<Button variant="outline">Cancel</Button>}
   275 |         >
   276 |           <Trash2 size={14} />
```

</details>

---

#### 500. [`src/pages/auto-pt/vulnerabilities/components/bulk-update.jsx:274`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/vulnerabilities/components/bulk-update.jsx#L274)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/vulnerabilities/components/bulk-update.jsx`
- **Line Number**: `274`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   273 |           confirmButton={<Button variant="primary">Proceed</Button>}
>  274 |           cancelButton={<Button variant="outline">Cancel</Button>}
   275 |         >
   276 |           <Trash2 size={14} />
   277 |         </ButtonWithConfirm>
```

</details>

---

#### 501. [`src/pages/auto-pt/vulnerabilities/components/vulnerability-actions.jsx:60`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/vulnerabilities/components/vulnerability-actions.jsx#L60)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/auto-pt/vulnerabilities/components/vulnerability-actions.jsx`
- **Line Number**: `60`
- **Button Label**: `View Ticket`
- **Current Variant**: `ghost`
- **Issue**: **Missing Icon**: The button with label "View Ticket" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>View Ticket</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    59 |         {vuln?.sentToVm ? (
>   60 |           <Button
    61 |             variant="ghost"
    62 |             onClick={() => window.open(`/vm/vulnerability-report?id=${vuln?.universalVulnId}&assessmentId=${vuln?.assessmentId}`, '_blank')}
    63 |             className="w-full justify-start px-2 py-1.5 h-auto font-normal text-[0.8125rem] rounded-md hover:bg-accent text-left bg-transparent"
```

</details>

---

### Pages: automation

#### 502. [`src/pages/automation/agent-details/components/AgentHeaderCard.jsx:149`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/AgentHeaderCard.jsx#L149)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/AgentHeaderCard.jsx`
- **Line Number**: `149`
- **Button Label**: `Edit`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Edit" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Edit</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   148 |           {onOpenEditModal && !agent?.agent_type && (
>  149 |             <Button
   150 |               variant="outline"
   151 |               onClick={onOpenEditModal}
   152 |               className="gap-1.5"
```

</details>

---

#### 503. [`src/pages/automation/agent-details/components/AgentHeaderCard.jsx:173`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/AgentHeaderCard.jsx#L173)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/AgentHeaderCard.jsx`
- **Line Number**: `173`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   172 |                   confirmButton={
>  173 |                     <Button variant="destructive" disabled={isDeleting}>
   174 |                       Delete
   175 |                     </Button>
   176 |                   }
```

</details>

---

#### 504. [`src/pages/automation/agent-details/components/AgentHeaderCard.jsx:177`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/AgentHeaderCard.jsx#L177)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/AgentHeaderCard.jsx`
- **Line Number**: `177`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   176 |                   }
>  177 |                   cancelButton={<Button variant="outline">Cancel</Button>}
   178 |                   className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
   179 |                 >
   180 |                   <Trash2 className="size-3.5" />
```

</details>

---

#### 505. [`src/pages/automation/agent-details/components/tabs/components/AddSkillsModal.jsx:163`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/tabs/components/AddSkillsModal.jsx#L163)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/tabs/components/AddSkillsModal.jsx`
- **Line Number**: `163`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   162 |           <div className="flex items-center gap-2">
>  163 |             <Button
   164 |               type="button"
   165 |               variant="outline"
   166 |               size="sm"
```

</details>

---

#### 506. [`src/pages/automation/agent-details/components/tabs/components/EditAgentInfoModal.jsx:57`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/tabs/components/EditAgentInfoModal.jsx#L57)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/tabs/components/EditAgentInfoModal.jsx`
- **Line Number**: `57`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    56 |         <div className="flex items-center justify-end gap-2">
>   57 |           <Button
    58 |             type="button"
    59 |             variant="outline"
    60 |             size="sm"
```

</details>

---

#### 507. [`src/pages/automation/agent-details/components/tabs/components/EditAgentInfoModal.jsx:66`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/tabs/components/EditAgentInfoModal.jsx#L66)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/tabs/components/EditAgentInfoModal.jsx`
- **Line Number**: `66`
- **Button Label**: `Saving... / Save`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    65 |           </Button>
>   66 |           <Button
    67 |             type="button"
    68 |             size="sm"
    69 |             onClick={handleDone}
```

</details>

---

#### 508. [`src/pages/automation/agent-details/components/tabs/components/ModelEngineCard.jsx:102`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/tabs/components/ModelEngineCard.jsx#L102)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/tabs/components/ModelEngineCard.jsx`
- **Line Number**: `102`
- **Button Label**: `Discard`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Discard" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Discard</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   101 |         <div className="flex items-center justify-end gap-2.5 pt-2">
>  102 |           <Button
   103 |             type="button"
   104 |             variant="outline"
   105 |             onClick={handleDiscard}
```

</details>

---

#### 509. [`src/pages/automation/agent-details/components/tabs/components/ModelEngineCard.jsx:109`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/tabs/components/ModelEngineCard.jsx#L109)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agent-details/components/tabs/components/ModelEngineCard.jsx`
- **Line Number**: `109`
- **Button Label**: `Saving... / Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   108 |           </Button>
>  109 |           <Button
   110 |             type="submit"
   111 |             disabled={isUpdating}
   112 |           >
```

</details>

---

#### 510. [`src/pages/automation/agents/components/create-agent-modal.jsx:73`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agents/components/create-agent-modal.jsx#L73)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agents/components/create-agent-modal.jsx`
- **Line Number**: `73`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    72 |         <div className="flex items-center justify-end gap-2">
>   73 |           <Button
    74 |             type="button"
    75 |             variant="outline"
    76 |             onClick={handleClose}
```

</details>

---

#### 511. [`src/pages/automation/agents/components/dropdowns/agent-list-dropdown.jsx:53`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agents/components/dropdowns/agent-list-dropdown.jsx#L53)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agents/components/dropdowns/agent-list-dropdown.jsx`
- **Line Number**: `53`
- **Button Label**: `Delete`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    52 |       confirmButton={
>   53 |         <Button variant="destructive" disabled={isDeleting || isPredefined}>
    54 |           Delete
    55 |         </Button>
    56 |       }
```

</details>

---

#### 512. [`src/pages/automation/agents/components/dropdowns/agent-list-dropdown.jsx:57`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agents/components/dropdowns/agent-list-dropdown.jsx#L57)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agents/components/dropdowns/agent-list-dropdown.jsx`
- **Line Number**: `57`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    56 |       }
>   57 |       cancelButton={<Button variant="outline">Cancel</Button>}
    58 |       className={`w-full justify-start !font-normal px-2 py-1.5 text-sm h-8 ${
    59 |         isPredefined
    60 |           ? 'cursor-not-allowed opacity-50'
```

</details>

---

#### 513. [`src/pages/automation/agents/components/modals/edit-agent-modal.jsx:157`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agents/components/modals/edit-agent-modal.jsx#L157)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/agents/components/modals/edit-agent-modal.jsx`
- **Line Number**: `157`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   156 |         <div className="flex items-center justify-end gap-2">
>  157 |           <Button
   158 |             type="button"
   159 |             variant="outline"
   160 |             onClick={handleClose}
```

</details>

---

#### 514. [`src/pages/automation/integrations/components/configure-adapter-modal.jsx:153`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/integrations/components/configure-adapter-modal.jsx#L153)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/integrations/components/configure-adapter-modal.jsx`
- **Line Number**: `153`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   152 |         <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
>  153 |           <Button variant="outline" onClick={handleClose} disabled={isSaving}>
   154 |             Cancel
   155 |           </Button>
   156 |           <Button onClick={handleSave} disabled={isSaving || !name.trim() || !apiKey.trim()}>
```

</details>

---

#### 515. [`src/pages/automation/integrations/components/configure-adapter-modal.jsx:156`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/integrations/components/configure-adapter-modal.jsx#L156)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/integrations/components/configure-adapter-modal.jsx`
- **Line Number**: `156`
- **Button Label**: `Saving... / Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   155 |           </Button>
>  156 |           <Button onClick={handleSave} disabled={isSaving || !name.trim() || !apiKey.trim()}>
   157 |             {isSaving ? 'Saving...' : 'Save Changes'}
   158 |           </Button>
   159 |         </div>
```

</details>

---

#### 516. [`src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx:67`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx#L67)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx`
- **Line Number**: `67`
- **Button Label**: `Proceed`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Proceed" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RefreshCw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RefreshCw className="size-4" />
  <span>Proceed</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    66 |               confirmButton={
>   67 |                 <Button variant="primary" disabled={isRetrying}>
    68 |                   Proceed
    69 |                 </Button>
    70 |               }
```

</details>

---

#### 517. [`src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx:71`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx#L71)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx`
- **Line Number**: `71`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    70 |               }
>   71 |               cancelButton={<Button variant="outline">Cancel</Button>}
    72 |               className="w-full justify-start hover:cursor-pointer !font-normal !hover:bg-transparent !bg-transparent !text-inherit px-2 py-1.5 text-sm h-8"
    73 |             >
    74 |               <span>{status === 'cancelled' || status === 'canceled' ? 'Retry' : 'Retry'}</span>
```

</details>

---

#### 518. [`src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx:94`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx#L94)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx`
- **Line Number**: `94`
- **Button Label**: `Cancel Run`
- **Current Variant**: `destructive`
- **Issue**: **Missing Icon**: The button with label "Cancel Run" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel Run</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    93 |                 confirmButton={
>   94 |                   <Button variant="destructive" disabled={isCanceling}>
    95 |                     Cancel Run
    96 |                   </Button>
    97 |                 }
```

</details>

---

#### 519. [`src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx:98`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx#L98)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/runs/components/dropdowns/runs-dropdown.jsx`
- **Line Number**: `98`
- **Button Label**: `Back`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Back" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowLeft className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowLeft className="size-4" />
  <span>Back</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    97 |                 }
>   98 |                 cancelButton={<Button variant="outline">Back</Button>}
    99 |                 className="w-full justify-start !font-normal hover:bg-red-200/20 px-2 py-1.5 text-sm h-8"
   100 |               >
   101 |                 <span className="text-destructive">Cancel</span>
```

</details>

---

#### 520. [`src/pages/automation/skills/components/AddFileDialog.jsx:94`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/AddFileDialog.jsx#L94)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/AddFileDialog.jsx`
- **Line Number**: `94`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    93 |         <div className="flex items-center justify-end gap-2.5 pt-2">
>   94 |           <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
    95 |             Cancel
    96 |           </Button>
    97 |           <Button size="sm" onClick={handleSave}>
```

</details>

---

#### 521. [`src/pages/automation/skills/components/AddFileDialog.jsx:97`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/AddFileDialog.jsx#L97)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/AddFileDialog.jsx`
- **Line Number**: `97`
- **Button Label**: `Create File`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Create File" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Create File</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    96 |           </Button>
>   97 |           <Button size="sm" onClick={handleSave}>
    98 |             Create File
    99 |           </Button>
   100 |         </div>
```

</details>

---

#### 522. [`src/pages/automation/skills/components/AddFolderDialog.jsx:54`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/AddFolderDialog.jsx#L54)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/AddFolderDialog.jsx`
- **Line Number**: `54`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    53 |         <div className="flex items-center justify-end gap-2.5 pt-2">
>   54 |           <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
    55 |             Cancel
    56 |           </Button>
    57 |           <Button size="sm" onClick={handleSave}>
```

</details>

---

#### 523. [`src/pages/automation/skills/components/AddFolderDialog.jsx:57`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/AddFolderDialog.jsx#L57)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/AddFolderDialog.jsx`
- **Line Number**: `57`
- **Button Label**: `Create Folder`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Create Folder" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Create Folder</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    56 |           </Button>
>   57 |           <Button size="sm" onClick={handleSave}>
    58 |             Create Folder
    59 |           </Button>
    60 |         </div>
```

</details>

---

#### 524. [`src/pages/automation/skills/components/CreateSkillModal.jsx:78`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/CreateSkillModal.jsx#L78)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/CreateSkillModal.jsx`
- **Line Number**: `78`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    77 |         <div className="flex items-center justify-end gap-2.5 pt-3">
>   78 |           <Button
    79 |             type="button"
    80 |             variant="outline"
    81 |             onClick={() => setOpen(false)}
```

</details>

---

#### 525. [`src/pages/automation/skills/components/CreateSkillModal.jsx:86`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/CreateSkillModal.jsx#L86)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/CreateSkillModal.jsx`
- **Line Number**: `86`
- **Button Label**: `Creating... / Create Skill`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Creating... / Create Skill" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Creating... / Create Skill</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    85 |           </Button>
>   86 |           <Button type="submit" disabled={isLoading}>
    87 |             {isLoading ? 'Creating...' : 'Create Skill'}
    88 |           </Button>
    89 |         </div>
```

</details>

---

#### 526. [`src/pages/automation/skills/components/EditSkillModal.jsx:80`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/EditSkillModal.jsx#L80)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/EditSkillModal.jsx`
- **Line Number**: `80`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    79 |         <div className="flex items-center justify-end gap-2.5 pt-3">
>   80 |           <Button
    81 |             type="button"
    82 |             variant="outline"
    83 |             onClick={() => setOpen(false)}
```

</details>

---

#### 527. [`src/pages/automation/skills/components/EditSkillModal.jsx:88`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/EditSkillModal.jsx#L88)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/EditSkillModal.jsx`
- **Line Number**: `88`
- **Button Label**: `Saving... / Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    87 |           </Button>
>   88 |           <Button type="submit" disabled={isLoading}>
    89 |             {isLoading ? 'Saving...' : 'Save Changes'}
    90 |           </Button>
    91 |         </div>
```

</details>

---

#### 528. [`src/pages/automation/skills/components/ImportSkillModal.jsx:236`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/ImportSkillModal.jsx#L236)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/skills/components/ImportSkillModal.jsx`
- **Line Number**: `236`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   235 |         <div className="flex items-center justify-end gap-2.5 pt-3">
>  236 |           <Button
   237 |             type="button"
   238 |             variant="outline"
   239 |             onClick={() => {
```

</details>

---

#### 529. [`src/pages/automation/workflow-edit/components/NodeConditionBuilder.jsx:510`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/workflow-edit/components/NodeConditionBuilder.jsx#L510)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/workflow-edit/components/NodeConditionBuilder.jsx`
- **Line Number**: `510`
- **Button Label**: `Add Condition`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add Condition") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   509 |           {!isUpdateMode && (
>  510 |             <Button
   511 |               type="button"
   512 |               size="sm"
   513 |               variant="ghost"
```

</details>

---

#### 530. [`src/pages/automation/workflow-edit/components/NodeConditionBuilder.jsx:521`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/workflow-edit/components/NodeConditionBuilder.jsx#L521)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/automation/workflow-edit/components/NodeConditionBuilder.jsx`
- **Line Number**: `521`
- **Button Label**: `Add Group`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add Group") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   520 |           {!isUpdateMode && (
>  521 |             <Button
   522 |               type="button"
   523 |               size="sm"
   524 |               variant="ghost"
```

</details>

---

### Pages: dashboards

#### 531. [`src/pages/dashboards/demo1/light-sidebar/demo1-light-sidebar-page.jsx:77`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/dashboards/demo1/light-sidebar/demo1-light-sidebar-page.jsx#L77)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/dashboards/demo1/light-sidebar/demo1-light-sidebar-page.jsx`
- **Line Number**: `77`
- **Button Label**: `Reset`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Reset" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <RotateCcw className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <RotateCcw className="size-4" />
  <span>Reset</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    76 |                 <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
>   77 |                   <Button variant="outline" onClick={handleDateRangeReset}>
    78 |                     Reset
    79 |                   </Button>
    80 |                   <Button onClick={handleDateRangeApply}>Apply</Button>
```

</details>

---

#### 532. [`src/pages/dashboards/demo1/light-sidebar/demo1-light-sidebar-page.jsx:80`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/dashboards/demo1/light-sidebar/demo1-light-sidebar-page.jsx#L80)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/dashboards/demo1/light-sidebar/demo1-light-sidebar-page.jsx`
- **Line Number**: `80`
- **Button Label**: `Apply`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Apply" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Apply</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    79 |                   </Button>
>   80 |                   <Button onClick={handleDateRangeApply}>Apply</Button>
    81 |                 </div>
    82 |               </PopoverContent>
    83 |             </Popover>
```

</details>

---

#### 533. [`src/pages/dashboards/demo2/components/manage-data.jsx:11`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/dashboards/demo2/components/manage-data.jsx#L11)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/dashboards/demo2/components/manage-data.jsx`
- **Line Number**: `11`
- **Button Label**: `Start`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Start" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>Start</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    10 |       description: 'Add an extra layer of security.',
>   11 |       control: <Button variant="outline">Start</Button>,
    12 |     },
    13 |     {
    14 |       title: 'Delete all of your data',
```

</details>

---

#### 534. [`src/pages/dashboards/demo2/components/manage-data.jsx:16`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/dashboards/demo2/components/manage-data.jsx#L16)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/dashboards/demo2/components/manage-data.jsx`
- **Line Number**: `16`
- **Button Label**: `Delete`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Delete" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Trash2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Trash2 className="size-4" />
  <span>Delete</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    15 |       description: 'Instantly sign out all services.',
>   16 |       control: <Button variant="outline">Delete</Button>,
    17 |     },
    18 |     {
    19 |       title: 'Auto Data Purge',
```

</details>

---

### Pages: integrations

#### 535. [`src/pages/integrations/components/configure-adapter-modal.jsx:220`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/integrations/components/configure-adapter-modal.jsx#L220)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/integrations/components/configure-adapter-modal.jsx`
- **Line Number**: `220`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   219 |         <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
>  220 |           <Button variant="outline" onClick={handleClose} disabled={isSaving}>
   221 |             Cancel
   222 |           </Button>
   223 |           <Button onClick={handleSave} disabled={isSaving}>
```

</details>

---

#### 536. [`src/pages/integrations/components/configure-adapter-modal.jsx:223`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/integrations/components/configure-adapter-modal.jsx#L223)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/integrations/components/configure-adapter-modal.jsx`
- **Line Number**: `223`
- **Button Label**: `Saving... / Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   222 |           </Button>
>  223 |           <Button onClick={handleSave} disabled={isSaving}>
   224 |             {isSaving ? 'Saving...' : 'Save Changes'}
   225 |           </Button>
   226 |         </div>
```

</details>

---

### Pages: notifications

#### 537. [`src/pages/notifications/components/milestone.jsx:51`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/notifications/components/milestone.jsx#L51)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/notifications/components/milestone.jsx`
- **Line Number**: `51`
- **Button Label**: `Mark as seen`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Mark as seen" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plug className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plug className="size-4" />
  <span>Mark as seen</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    50 |         {/* Show when not seen */}
>   51 |         {!data?.seen && <Button disabled={isMarkingSeen} onClick={handleMarkNotificationAsSeen} mode="link" underline="solid">
    52 |           Mark as seen
    53 |         </Button>}
    54 |         </div>
```

</details>

---

### Pages: public

#### 538. [`src/pages/public/change-mgmt-req/success-component.jsx:9`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/change-mgmt-req/success-component.jsx#L9)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/change-mgmt-req/success-component.jsx`
- **Line Number**: `9`
- **Button Label**: `Create Another Request`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Create Another Request" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Create Another Request</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
     8 |       <span>Change Request created successfully!</span>
>    9 |       <Button variant="primary" onClick={() => window.location.reload()} className=" mt-5">
    10 |         Create Another Request
    11 |       </Button>
    12 |     </div>
```

</details>

---

#### 539. [`src/pages/public/demo-dashboard/cvss-scoring-selection.jsx:49`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/cvss-scoring-selection.jsx#L49)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/cvss-scoring-selection.jsx`
- **Line Number**: `49`
- **Button Label**: `Save Changes`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    48 |           </Button>
>   49 |           <Button size="sm" className="h-9 px-5">
    50 |             Save Changes
    51 |           </Button>
    52 |         </div>
```

</details>

---

#### 540. [`src/pages/public/demo-dashboard/demo-magic-login.jsx:101`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/demo-magic-login.jsx#L101)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/demo-magic-login.jsx`
- **Line Number**: `101`
- **Button Label**: `Return to Login`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Return to Login" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <LogIn className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <LogIn className="size-4" />
  <span>Return to Login</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   100 |         {status === 'error' && (
>  101 |           <Button 
   102 |             onClick={() => navigate('/auth/signin')}
   103 |             variant="outline"
   104 |             className="w-full"
```

</details>

---

#### 541. [`src/pages/public/demo-dashboard/demo-otp.jsx:167`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/demo-otp.jsx#L167)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/demo-otp.jsx`
- **Line Number**: `167`
- **Button Label**: `Verifying... / Continue`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Verifying... / Continue" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Verifying... / Continue</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   166 | 
>  167 |         <Button onClick={handleSubmit} disabled={isLoading}>
   168 |           {isLoading ? 'Verifying...' : 'Continue'}
   169 |         </Button>
   170 | 
```

</details>

---

#### 542. [`src/pages/public/demo-dashboard/vendors.jsx:308`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vendors.jsx#L308)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vendors.jsx`
- **Line Number**: `308`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   307 |         <DialogFooter>
>  308 |           <Button variant="outline" size="md" type="button" onClick={() => onOpenChange(false)}>
   309 |             Cancel
   310 |           </Button>
   311 |           <Button
```

</details>

---

#### 543. [`src/pages/public/demo-dashboard/vendors.jsx:311`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vendors.jsx#L311)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vendors.jsx`
- **Line Number**: `311`
- **Button Label**: `Save Changes / Add Vendor`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes / Add Vendor" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes / Add Vendor</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   310 |           </Button>
>  311 |           <Button
   312 |             variant="primary"
   313 |             size="md"
   314 |             type="submit"
```

</details>

---

#### 544. [`src/pages/public/demo-dashboard/vendors.jsx:408`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vendors.jsx#L408)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vendors.jsx`
- **Line Number**: `408`
- **Button Label**: `Close`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Close" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Close</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   407 |         <DialogFooter>
>  408 |           <Button variant="outline" size="md" onClick={() => onOpenChange(false)}>
   409 |             Close
   410 |           </Button>
   411 |         </DialogFooter>
```

</details>

---

#### 545. [`src/pages/public/demo-dashboard/vendors.jsx:622`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vendors.jsx#L622)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vendors.jsx`
- **Line Number**: `622`
- **Button Label**: `Add your first vendor`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Add your first vendor" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Add your first vendor</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   621 |                       {!searchQuery && (
>  622 |                         <Button variant="outline" size="sm" onClick={openCreate}>
   623 |                           Add your first vendor
   624 |                         </Button>
   625 |                       )}
```

</details>

---

#### 546. [`src/pages/public/demo-dashboard/vuln-sources.jsx:130`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vuln-sources.jsx#L130)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vuln-sources.jsx`
- **Line Number**: `130`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   129 |         <DialogFooter>
>  130 |           <Button variant="outline" size="md" onClick={() => onOpenChange(false)}>Cancel</Button>
   131 |           <Button variant="primary" size="md" type="submit" form="source-form" disabled={!form.name.trim()}>{isEdit ? 'Save Changes' : 'Add Source'}</Button>
   132 |         </DialogFooter>
   133 |       </DialogContent>
```

</details>

---

#### 547. [`src/pages/public/demo-dashboard/vuln-sources.jsx:131`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vuln-sources.jsx#L131)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vuln-sources.jsx`
- **Line Number**: `131`
- **Button Label**: `Save Changes / Add Source`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Save Changes / Add Source" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Changes / Add Source</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   130 |           <Button variant="outline" size="md" onClick={() => onOpenChange(false)}>Cancel</Button>
>  131 |           <Button variant="primary" size="md" type="submit" form="source-form" disabled={!form.name.trim()}>{isEdit ? 'Save Changes' : 'Add Source'}</Button>
   132 |         </DialogFooter>
   133 |       </DialogContent>
   134 |     </Dialog>
```

</details>

---

#### 548. [`src/pages/public/demo-dashboard/vuln-sources.jsx:225`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vuln-sources.jsx#L225)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/demo-dashboard/vuln-sources.jsx`
- **Line Number**: `225`
- **Button Label**: `Close`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Close" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Close</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   224 |         </DialogBody>
>  225 |         <DialogFooter><Button variant="outline" size="md" onClick={() => onOpenChange(false)}>Close</Button></DialogFooter>
   226 |       </DialogContent>
   227 |     </Dialog>
   228 |   );
```

</details>

---

#### 549. [`src/pages/public/expiry-date/account-basic-content.jsx:86`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/expiry-date/account-basic-content.jsx#L86)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/expiry-date/account-basic-content.jsx`
- **Line Number**: `86`
- **Button Label**: `Saving... / Save`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Saving... / Save" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Saving... / Save</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    85 |                 </div>
>   86 |                 <Button variant="outline" onClick={handleSaveClick} disabled={isLoading}>
    87 |                   {isLoading ? 'Saving...' : 'Save'}
    88 |                 </Button>
    89 |               </>
```

</details>

---

#### 550. [`src/pages/public/expiry-date/account-basic-content.jsx:91`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/expiry-date/account-basic-content.jsx#L91)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/expiry-date/account-basic-content.jsx`
- **Line Number**: `91`
- **Button Label**: `Update`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Update" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Update</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    90 |             ) : (
>   91 |               <Button variant="outline" onClick={handleEditClick}>
    92 |                 Update
    93 |               </Button>
    94 |             )}
```

</details>

---

#### 551. [`src/pages/public/pentest-scope/components/assets-in-scope.jsx:88`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/components/assets-in-scope.jsx#L88)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/components/assets-in-scope.jsx`
- **Line Number**: `88`
- **Button Label**: `Add domain`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add domain") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
    87 |                     <Label>Domains & Subdomains <span className="text-destructive">*</span></Label>
>   88 |                     <Button
    89 |                         variant="ghost"
    90 |                         size="sm"
    91 |                         onClick={() => addField('domains')}
```

</details>

---

#### 552. [`src/pages/public/pentest-scope/components/assets-in-scope.jsx:127`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/components/assets-in-scope.jsx#L127)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/components/assets-in-scope.jsx`
- **Line Number**: `127`
- **Button Label**: `Add IP range`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add IP range") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   126 |                     <Label>IP Ranges (CIDR Notation)</Label>
>  127 |                     <Button
   128 |                         variant="ghost"
   129 |                         size="sm"
   130 |                         onClick={() => addField('ipRanges')}
```

</details>

---

#### 553. [`src/pages/public/pentest-scope/components/assets-in-scope.jsx:166`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/components/assets-in-scope.jsx#L166)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/components/assets-in-scope.jsx`
- **Line Number**: `166`
- **Button Label**: `Add API endpoint`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add API endpoint") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
   165 |                     <Label>API Endpoints</Label>
>  166 |                     <Button
   167 |                         variant="ghost"
   168 |                         size="sm"
   169 |                         onClick={() => addField('apiEndpoints')}
```

</details>

---

#### 554. [`src/pages/public/pentest-scope/components/out-of-scope.jsx:40`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/components/out-of-scope.jsx#L40)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/components/out-of-scope.jsx`
- **Line Number**: `40`
- **Button Label**: `Add exclusion`
- **Current Variant**: `ghost`
- **Issue**: **Invalid Variant on Action Button**: This button represents an actionable operation ("Add exclusion") but uses `variant="ghost"`. Action buttons should use `variant="primary"` to adhere to the design system's action hierarchy.

**Suggested Change**:

Change `variant="ghost"` to `variant="primary"`:
```jsx
<Button variant="primary" ...>
```

<details>
<summary>View Source Context</summary>

```jsx
    39 |                     <Label>Exclusions</Label>
>   40 |                     <Button
    41 |                         variant="ghost"
    42 |                         size="sm"
    43 |                         onClick={() => addField('exclusions')}
```

</details>

---

#### 555. [`src/pages/public/pentest-scope/pentest-scope.jsx:279`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/pentest-scope.jsx#L279)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/pentest-scope.jsx`
- **Line Number**: `279`
- **Button Label**: `Previous`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Previous" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowLeft className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowLeft className="size-4" />
  <span>Previous</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   278 |                                     {currentStep !== 'assets' && (
>  279 |                                         <Button variant="outline" onClick={handlePrevious}>
   280 |                                             Previous
   281 |                                         </Button>
   282 |                                     )}
```

</details>

---

#### 556. [`src/pages/public/pentest-scope/pentest-scope.jsx:286`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/pentest-scope.jsx#L286)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/pentest-scope/pentest-scope.jsx`
- **Line Number**: `286`
- **Button Label**: `Save Draft`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Save Draft" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Save className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Save className="size-4" />
  <span>Save Draft</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   285 |                                 <div className="flex gap-3">
>  286 |                                     <Button variant="outline" onClick={handleSaveDraft}>
   287 |                                         Save Draft
   288 |                                     </Button>
   289 | 
```

</details>

---

#### 557. [`src/pages/public/report-new-vuln/report-new.jsx:393`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/report-new-vuln/report-new.jsx#L393)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/report-new-vuln/report-new.jsx`
- **Line Number**: `393`
- **Button Label**: `✕ / + Add`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "✕ / + Add" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>✕ / + Add</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   392 | 
>  393 |               <Button
   394 |                 size="sm"
   395 |                 className=" mb-2"
   396 |                 variant="outline"
```

</details>

---

#### 558. [`src/pages/public/report-new-vuln/report-new.jsx:602`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/report-new-vuln/report-new.jsx#L602)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public/report-new-vuln/report-new.jsx`
- **Line Number**: `602`
- **Button Label**: `+ Add Vulnerability`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "+ Add Vulnerability" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>+ Add Vulnerability</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   601 |           <div className="w-full flex items-center justify-end">
>  602 |             <Button variant="primary" onClick={handleSubmit}>
   603 |               + Add Vulnerability
   604 |             </Button>
   605 |           </div>
```

</details>

---

### Pages: public-profile

#### 559. [`src/pages/public-profile/activity/profile-basic-content.jsx:105`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public-profile/activity/profile-basic-content.jsx#L105)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public-profile/activity/profile-basic-content.jsx`
- **Line Number**: `105`
- **Button Label**: `{year}`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "{year}" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Play className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Play className="size-4" />
  <span>{year}</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   104 |         {years.map((year, index) => (
>  105 |           <Button
   106 |             key={index}
   107 |             variant={year === currentYear ? 'primary' : 'dim'}
   108 |             appearance="ghost"
```

</details>

---

#### 560. [`src/pages/public-profile/profiles/feeds/post/saves.jsx:33`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public-profile/profiles/feeds/post/saves.jsx#L33)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/public-profile/profiles/feeds/post/saves.jsx`
- **Line Number**: `33`
- **Button Label**: `Request Access`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Request Access" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <KeyRound className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <KeyRound className="size-4" />
  <span>Request Access</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    32 |         <div className="flex justify-center">
>   33 |           <Button variant="outline">Request Access</Button>
    34 |         </div>
    35 |       </div>
    36 |     </Fragment>
```

</details>

---

### Pages: service-account

#### 561. [`src/pages/service-account/components/create-org-modal.jsx:178`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/create-org-modal.jsx#L178)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/create-org-modal.jsx`
- **Line Number**: `178`
- **Button Label**: `Continue`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Continue" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Continue</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   177 |                 <div className="flex justify-end pt-4">
>  178 |                   <Button
   179 |                     type="button"
   180 |                     onClick={handleCompleteInfo}
   181 |                     className="bg-blue-600 hover:bg-blue-700"
```

</details>

---

#### 562. [`src/pages/service-account/components/create-org-modal.jsx:265`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/create-org-modal.jsx#L265)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/create-org-modal.jsx`
- **Line Number**: `265`
- **Button Label**: `Back`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Back" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowLeft className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowLeft className="size-4" />
  <span>Back</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   264 |                 <div className="flex justify-between pt-4">
>  265 |                   <Button type="button" variant="outline" onClick={handleBack}>
   266 |                     Back
   267 |                   </Button>
   268 |                   <Button
```

</details>

---

#### 563. [`src/pages/service-account/components/create-org-modal.jsx:268`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/create-org-modal.jsx#L268)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/create-org-modal.jsx`
- **Line Number**: `268`
- **Button Label**: `Creating... / Complete Setup`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Creating... / Complete Setup" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Plus className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Plus className="size-4" />
  <span>Creating... / Complete Setup</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   267 |                   </Button>
>  268 |                   <Button
   269 |                     type="submit"
   270 |                     disabled={creatingNewOrg || !form.formState.isValid}
   271 |                     className="bg-blue-600 hover:bg-blue-700"
```

</details>

---

#### 564. [`src/pages/service-account/components/edit-org-modal.jsx:61`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/edit-org-modal.jsx#L61)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/edit-org-modal.jsx`
- **Line Number**: `61`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    60 |                 <div className="flex justify-end p-2 gap-2">
>   61 |                     <Button variant="outline" onClick={handleClose}>
    62 |                         Cancel
    63 |                     </Button>
    64 |                     <Button
```

</details>

---

#### 565. [`src/pages/service-account/components/edit-org-modal.jsx:64`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/edit-org-modal.jsx#L64)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/edit-org-modal.jsx`
- **Line Number**: `64`
- **Button Label**: `Updating... / Update`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Updating... / Update" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Updating... / Update</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    63 |                     </Button>
>   64 |                     <Button
    65 |                         onClick={handleUpdate}
    66 |                         disabled={updatingOrg}
    67 |                     >
```

</details>

---

#### 566. [`src/pages/service-account/components/members-tab.jsx:301`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/members-tab.jsx#L301)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/pages/service-account/components/members-tab.jsx`
- **Line Number**: `301`
- **Button Label**: `Revoke Access / Grant Access`
- **Current Variant**: `dynamic`
- **Issue**: **Missing Icon**: The button with label "Revoke Access / Grant Access" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Revoke Access / Grant Access</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   300 |         confirmButton={
>  301 |           <Button variant={confirmState.isRevoke ? 'destructive' : 'primary'}>
   302 |             {confirmState.isRevoke ? 'Revoke Access' : 'Grant Access'}
   303 |           </Button>
   304 |         }
```

</details>

---

### Source: partials

#### 567. [`src/partials/dialogs/report-user-dialog.jsx:125`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/report-user-dialog.jsx#L125)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/report-user-dialog.jsx`
- **Line Number**: `125`
- **Button Label**: `Report this person`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Report this person" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ShieldAlert className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ShieldAlert className="size-4" />
  <span>Report this person</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   124 |       <div className="flex items-center gap-2.5 justify-end px-5">
>  125 |         <Button variant="primary">Report this person</Button>
   126 |         <Button variant="outline">Cancel</Button>
   127 |       </div>
   128 |     );
```

</details>

---

#### 568. [`src/partials/dialogs/report-user-dialog.jsx:126`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/report-user-dialog.jsx#L126)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/report-user-dialog.jsx`
- **Line Number**: `126`
- **Button Label**: `Cancel`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Cancel" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Cancel</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   125 |         <Button variant="primary">Report this person</Button>
>  126 |         <Button variant="outline">Cancel</Button>
   127 |       </div>
   128 |     );
   129 |   };
```

</details>

---

#### 569. [`src/partials/dialogs/search/search-docs.jsx:49`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/search/search-docs.jsx#L49)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/search/search-docs.jsx`
- **Line Number**: `49`
- **Button Label**: `Go to Users`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Go to Users" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Go to Users</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    48 |         <AccordionMenuItem className="px-4 pt-2.5" value={''}>
>   49 |           <Button variant="outline" className="mx-auto w-full max-w-full">
    50 |             Go to Users
    51 |           </Button>
    52 |         </AccordionMenuItem>
```

</details>

---

#### 570. [`src/partials/dialogs/search/search-empty.jsx:30`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/search/search-empty.jsx#L30)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/search/search-empty.jsx`
- **Line Number**: `30`
- **Button Label**: `View Projects`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "View Projects" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>View Projects</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    29 |       <div className="flex justify-center">
>   30 |         <Button variant="outline">View Projects</Button>
    31 |       </div>
    32 |     </div>
    33 |   );
```

</details>

---

#### 571. [`src/partials/dialogs/search/search-integrations.jsx:59`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/search/search-integrations.jsx#L59)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/search/search-integrations.jsx`
- **Line Number**: `59`
- **Button Label**: `Go to Users`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Go to Users" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Go to Users</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    58 |           <AccordionMenuItem className="px-4 pt-2" value={''}>
>   59 |             <Button variant="outline" className="mx-auto w-full max-w-full">
    60 |               Go to Users
    61 |             </Button>
    62 |           </AccordionMenuItem>
```

</details>

---

#### 572. [`src/partials/dialogs/search/search-no-results.jsx:29`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/search/search-no-results.jsx#L29)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/search/search-no-results.jsx`
- **Line Number**: `29`
- **Button Label**: `View Projects`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "View Projects" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>View Projects</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    28 |       <div className="flex justify-center">
>   29 |         <Button variant="outline">View Projects</Button>
    30 |       </div>
    31 |     </div>
    32 |   );
```

</details>

---

#### 573. [`src/partials/dialogs/search/search-users.jsx:69`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/search/search-users.jsx#L69)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/search/search-users.jsx`
- **Line Number**: `69`
- **Button Label**: `Go to Users`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Go to Users" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Go to Users</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    68 |           <AccordionMenuItem className="px-4 pt-2" value={''}>
>   69 |             <Button variant="outline" className="mx-auto w-full max-w-full">
    70 |               Go to Users
    71 |             </Button>
    72 |           </AccordionMenuItem>
```

</details>

---

#### 574. [`src/partials/dialogs/share-profile/share-profile-settings.jsx:42`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/share-profile/share-profile-settings.jsx#L42)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/share-profile/share-profile-settings.jsx`
- **Line Number**: `42`
- **Button Label**: `Done`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Done" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Done</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    41 | 
>   42 |       <Button variant="primary" className="mx-auto w-full max-w-full">
    43 |         Done
    44 |       </Button>
    45 |     </div>
```

</details>

---

#### 575. [`src/partials/dialogs/share-profile/share-profile-via-email.jsx:24`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/share-profile/share-profile-via-email.jsx#L24)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/dialogs/share-profile/share-profile-via-email.jsx`
- **Line Number**: `24`
- **Button Label**: `Share`
- **Current Variant**: `primary`
- **Issue**: **Missing Icon**: The button with label "Share" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Share2 className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Share2 className="size-4" />
  <span>Share</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    23 | 
>   24 |         <Button size="md">Share</Button>
    25 |       </div>
    26 |     </div>
    27 |   );
```

</details>

---

#### 576. [`src/partials/topbar/chat-sheet.jsx:284`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/chat-sheet.jsx#L284)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/chat-sheet.jsx`
- **Line Number**: `284`
- **Button Label**: `Decline`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Decline" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Decline</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   283 |               <div className="flex gap-2">
>  284 |                 <Button size="sm" variant="outline">
   285 |                   Decline
   286 |                 </Button>
   287 |                 <Button size="sm" variant="mono">
```

</details>

---

#### 577. [`src/partials/topbar/chat-sheet.jsx:287`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/chat-sheet.jsx#L287)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/chat-sheet.jsx`
- **Line Number**: `287`
- **Button Label**: `Accept`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "Accept" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Accept</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   286 |                 </Button>
>  287 |                 <Button size="sm" variant="mono">
   288 |                   Accept
   289 |                 </Button>
   290 |               </div>
```

</details>

---

#### 578. [`src/partials/topbar/chat-sheet.jsx:312`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/chat-sheet.jsx#L312)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/chat-sheet.jsx`
- **Line Number**: `312`
- **Button Label**: `Send`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "Send" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Send className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Send className="size-4" />
  <span>Send</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   311 |               </Button>
>  312 |               <Button size="sm" variant="mono">
   313 |                 Send
   314 |               </Button>
   315 |             </div>
```

</details>

---

#### 579. [`src/partials/topbar/notifications/item-10.jsx:87`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-10.jsx#L87)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-10.jsx`
- **Line Number**: `87`
- **Button Label**: `Decline`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Decline" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Decline</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    86 |         <div className="flex flex-wrap gap-2.5">
>   87 |           <Button size="sm" variant="outline">
    88 |             Decline
    89 |           </Button>
    90 |           <Button size="sm" variant="mono">
```

</details>

---

#### 580. [`src/partials/topbar/notifications/item-10.jsx:90`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-10.jsx#L90)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-10.jsx`
- **Line Number**: `90`
- **Button Label**: `Accept`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "Accept" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Accept</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    89 |           </Button>
>   90 |           <Button size="sm" variant="mono">
    91 |             Accept
    92 |           </Button>
    93 |         </div>
```

</details>

---

#### 581. [`src/partials/topbar/notifications/item-13.jsx:73`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-13.jsx#L73)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-13.jsx`
- **Line Number**: `73`
- **Button Label**: `Decline`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Decline" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Decline</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    72 |         <div className="flex flex-wrap gap-2.5">
>   73 |           <Button size="sm" variant="outline">
    74 |             Decline
    75 |           </Button>
    76 |           <Button size="sm" variant="mono">
```

</details>

---

#### 582. [`src/partials/topbar/notifications/item-13.jsx:76`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-13.jsx#L76)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-13.jsx`
- **Line Number**: `76`
- **Button Label**: `Accept`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "Accept" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Accept</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    75 |           </Button>
>   76 |           <Button size="sm" variant="mono">
    77 |             Accept
    78 |           </Button>
    79 |         </div>
```

</details>

---

#### 583. [`src/partials/topbar/notifications/item-17.jsx:62`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-17.jsx#L62)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-17.jsx`
- **Line Number**: `62`
- **Button Label**: `Decline`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Decline" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Decline</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    61 |         <div className="flex flex-wrap gap-2.5">
>   62 |           <Button size="sm" variant="outline">
    63 |             Decline
    64 |           </Button>
    65 |           <Button size="sm" variant="mono">
```

</details>

---

#### 584. [`src/partials/topbar/notifications/item-17.jsx:65`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-17.jsx#L65)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-17.jsx`
- **Line Number**: `65`
- **Button Label**: `Accept`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "Accept" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Accept</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    64 |           </Button>
>   65 |           <Button size="sm" variant="mono">
    66 |             Accept
    67 |           </Button>
    68 |         </div>
```

</details>

---

#### 585. [`src/partials/topbar/notifications/item-20.jsx:45`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-20.jsx#L45)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-20.jsx`
- **Line Number**: `45`
- **Button Label**: `Go to profile`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "Go to profile" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <ArrowRight className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <ArrowRight className="size-4" />
  <span>Go to profile</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    44 |           </Button>
>   45 |           <Button size="sm" variant="mono">
    46 |             Go to profile
    47 |           </Button>
    48 |         </div>
```

</details>

---

#### 586. [`src/partials/topbar/notifications/item-3.jsx:51`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-3.jsx#L51)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-3.jsx`
- **Line Number**: `51`
- **Button Label**: `Decline`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Decline" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Decline</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    50 |         <div className="flex flex-wrap gap-2.5">
>   51 |           <Button size="sm" variant="outline">
    52 |             Decline
    53 |           </Button>
    54 |           <Button size="sm" variant="mono">
```

</details>

---

#### 587. [`src/partials/topbar/notifications/item-3.jsx:54`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-3.jsx#L54)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-3.jsx`
- **Line Number**: `54`
- **Button Label**: `Accept`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "Accept" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Accept</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    53 |           </Button>
>   54 |           <Button size="sm" variant="mono">
    55 |             Accept
    56 |           </Button>
    57 |         </div>
```

</details>

---

#### 588. [`src/partials/topbar/notifications/item-7.jsx:132`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-7.jsx#L132)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-7.jsx`
- **Line Number**: `132`
- **Button Label**: `Decline`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Decline" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <X className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <X className="size-4" />
  <span>Decline</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   131 |         <div className="flex flex-wrap gap-2.5">
>  132 |           <Button size="sm" variant="outline">
   133 |             Decline
   134 |           </Button>
   135 |           <Button size="sm" variant="mono">
```

</details>

---

#### 589. [`src/partials/topbar/notifications/item-7.jsx:135`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-7.jsx#L135)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/item-7.jsx`
- **Line Number**: `135`
- **Button Label**: `Accept`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "Accept" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Check className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Check className="size-4" />
  <span>Accept</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   134 |           </Button>
>  135 |           <Button size="sm" variant="mono">
   136 |             Accept
   137 |           </Button>
   138 |         </div>
```

</details>

---

#### 590. [`src/partials/topbar/notifications/vm/blocker-notification.jsx:78`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/vm/blocker-notification.jsx#L78)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/vm/blocker-notification.jsx`
- **Line Number**: `78`
- **Button Label**: `Mark Resolved`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "Mark Resolved" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Mark Resolved</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    77 |       return (
>   78 |         <Button
    79 |           size="sm"
    80 |           variant="mono"
    81 |           disabled={isLoading}
```

</details>

---

#### 591. [`src/partials/topbar/notifications/vm/blocker-notification.jsx:90`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/vm/blocker-notification.jsx#L90)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/vm/blocker-notification.jsx`
- **Line Number**: `90`
- **Button Label**: `Reopen Blocker`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Reopen Blocker" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Reopen Blocker</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
    89 |       return (
>   90 |         <Button
    91 |           size="sm"
    92 |           variant="outline"
    93 |           disabled={isLoading}
```

</details>

---

#### 592. [`src/partials/topbar/notifications/vm/blocker-notification.jsx:102`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/vm/blocker-notification.jsx#L102)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/vm/blocker-notification.jsx`
- **Line Number**: `102`
- **Button Label**: `Resolve Blocker`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "Resolve Blocker" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Pencil className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Pencil className="size-4" />
  <span>Resolve Blocker</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   101 |       return (
>  102 |         <Button
   103 |           size="sm"
   104 |           variant="mono"
   105 |           disabled={isLoading}
```

</details>

---

#### 593. [`src/partials/topbar/notifications/vs/vs-scan.jsx:148`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/vs/vs-scan.jsx#L148)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/vs/vs-scan.jsx`
- **Line Number**: `148`
- **Button Label**: `View Findings`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "View Findings" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Eye className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Eye className="size-4" />
  <span>View Findings</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   147 |                     <Link to={targetLink}>
>  148 |                         <Button size="sm" variant="mono">
   149 |                             View Findings
   150 |                         </Button>
   151 |                     </Link>
```

</details>

---

#### 594. [`src/partials/topbar/notifications/was/was-scan-notification.jsx:206`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/was/was-scan-notification.jsx#L206)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications/was/was-scan-notification.jsx`
- **Line Number**: `206`
- **Button Label**: `{buttonText}`
- **Current Variant**: `mono`
- **Issue**: **Missing Icon**: The button with label "{buttonText}" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <Sparkles className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <Sparkles className="size-4" />
  <span>{buttonText}</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   205 |             <Link to={buttonLink}>
>  206 |               <Button size="sm" variant="mono">
   207 |                 {buttonText}
   208 |               </Button>
   209 |             </Link>
```

</details>

---

#### 595. [`src/partials/topbar/notifications-sheet.jsx:737`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications-sheet.jsx#L737)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/notifications-sheet.jsx`
- **Line Number**: `737`
- **Button Label**: `Mark all as read`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Mark all as read" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <CheckCheck className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <CheckCheck className="size-4" />
  <span>Mark all as read</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   736 |           {/* <Button variant="outline">Archive all</Button> */}
>  737 |           <Button
   738 |             variant="outline"
   739 |             onClick={() =>
   740 |               toast.promise(
```

</details>

---

#### 596. [`src/partials/topbar/user-dropdown-menu.jsx:256`](file:///home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/user-dropdown-menu.jsx#L256)

- **Full File Path**: `/home/shoaib/localdisk/work/dev-setup/snapsec-ui/src/partials/topbar/user-dropdown-menu.jsx`
- **Line Number**: `256`
- **Button Label**: `Logout`
- **Current Variant**: `outline`
- **Issue**: **Missing Icon**: The button with label "Logout" lacks a contextual icon. Adding an icon enhances visual affordance and usability.

**Suggested Change**:

Import and add <LogOut className="size-4" /> from `lucide-react` inside the Button:
```jsx
<Button ...>
  <LogOut className="size-4" />
  <span>Logout</span>
</Button>
```

<details>
<summary>View Source Context</summary>

```jsx
   255 |         <div className="p-2 mt-1">
>  256 |           <Button
   257 |             variant="outline"
   258 |             size="sm"
   259 |             className="w-full"
```

</details>

---

