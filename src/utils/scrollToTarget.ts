export const scrollToTarget = (
  element: HTMLElement | null,
  offset = 0
): void => {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const top = rect.top + window.pageYOffset + offset;
  requestAnimationFrame(() => {
    window.scrollTo({ top, behavior: 'smooth' });
  });
};

export default scrollToTarget;
