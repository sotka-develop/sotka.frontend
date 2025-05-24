// composables/useScrollLock.ts

export const disableScroll = () => {
  const scrollY = window.pageYOffset;
  const { body } = document;

  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
};

export const enableScroll = () => {
  const { body } = document;
  const scrollY = body.style.top;

  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';

  window.scrollTo(0, parseInt(scrollY || '0') * -1);
};
