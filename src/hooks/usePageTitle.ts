import { useEffect } from 'react';

/**
 * Options for configuring the page title
 * @interface UsePageTitleOptions
 */
interface UsePageTitleOptions {
  /** The main title to display in the browser tab */
  title: string;
  /** Optional suffix to append to the title (defaults to "Ostentans") */
  suffix?: string;
}

/**
 * Custom React hook for dynamically updating the document title
 * 
 * This hook automatically updates the browser tab title when the component mounts
 * and restores the default title when the component unmounts.
 * 
 * @param {UsePageTitleOptions} options - Configuration object for the page title
 * @param {string} options.title - The main title to display
 * @param {string} [options.suffix="Ostentans"] - Optional suffix appended with " | " separator
 * 
 * @example
 * // Basic usage with default suffix
 * usePageTitle({ title: "Dashboard" }); 
 * // Result: "Dashboard | Ostentans"
 * 
 * @example
 * // Custom suffix
 * usePageTitle({ title: "Profile", suffix: "My App" }); 
 * // Result: "Profile | My App"
 * 
 * @example
 * // No suffix
 * usePageTitle({ title: "Standalone Page", suffix: "" }); 
 * // Result: "Standalone Page"
 * 
 * @example
 * // Usage in a React component
 * const HomePage = () => {
 *   usePageTitle({ title: "Home" });
 *   return <div>Welcome to the home page!</div>;
 * };
 */
export const usePageTitle = ({ title, suffix = "Ostentans" }: UsePageTitleOptions) => {
  useEffect(() => {
    const fullTitle: string = suffix ? `${title} | ${suffix}` : title;
    document.title = fullTitle;
    
    // Cleanup function to restore default title when component unmounts
    return () => {
      document.title = suffix || "Ostentans";
    };
  }, [title, suffix]);
};

export default usePageTitle;