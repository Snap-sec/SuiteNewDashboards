import { useAuth } from '@/auth/context/auth-context';

/**
 * AIGuard component wraps UI elements that should only be visible 
 * when AI features are enabled in the user's configuration.
 * 
 * Condition: localStorage.getItem("user").ai_configuration.enabled === true
 */
const AIGuard = ({ children, fallback = null }) => {
  const { user } = useAuth();

  // Check if AI configuration is enabled for the current user
  const isAIEnabled = user?.ai_configuration?.enabled === true;

  if (!isAIEnabled) {
    return fallback;
  }

  return <>{children}</>;
};


export default AIGuard;
