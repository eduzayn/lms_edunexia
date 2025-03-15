/**
 * Mock for Next.js navigation functions
 * Use this to test components that use Next.js navigation hooks
 */

export const mockNextNavigation = () => {
  const router = {
    push: jest.fn().mockImplementation((path) => {
      // Simulate navigation by updating window.location.pathname
      // This helps tests that check for navigation
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          pathname: path,
        },
        writable: true,
      });
      return Promise.resolve(true);
    }),
    replace: jest.fn().mockImplementation((path) => {
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          pathname: path,
        },
        writable: true,
      });
      return Promise.resolve(true);
    }),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
  };

  // Mock navigation for anchor tags
  // This is needed because jsdom doesn't implement navigation
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor && anchor.getAttribute('href')) {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href) {
        router.push(href);
      }
    }
  });

  // Instead of trying to redefine window.location.href, we'll monkey patch it
  // This is safer in the Jest environment
  const originalWindowLocation = window.location;
  delete window.location;
  window.location = {
    ...originalWindowLocation,
    assign: jest.fn().mockImplementation((href) => {
      if (typeof href === 'string') {
        const url = new URL(href, originalWindowLocation.origin);
        router.push(url.pathname);
      }
    }),
    replace: jest.fn().mockImplementation((href) => {
      if (typeof href === 'string') {
        const url = new URL(href, originalWindowLocation.origin);
        router.push(url.pathname);
      }
    }),
    reload: jest.fn(),
    toString: jest.fn().mockImplementation(() => originalWindowLocation.toString()),
  } as Location;

  return {
    useRouter: jest.fn(() => router),
    usePathname: jest.fn(() => '/'),
    useSearchParams: jest.fn(() => new URLSearchParams()),
    redirect: jest.fn().mockImplementation((path) => {
      router.push(path);
      return Promise.resolve(true);
    }),
    router,
  };
};
