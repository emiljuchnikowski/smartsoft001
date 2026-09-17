const ALT_TEXT = 'A photo'
const CAPTION = "It's fine"

// #region usage
export const Playground = {
  render: () => ({
    template: `
      <img src="/photo.jpg" alt="${ALT_TEXT}" />
      <p>${CAPTION}</p>
    `,
  }),
}
// #endregion
