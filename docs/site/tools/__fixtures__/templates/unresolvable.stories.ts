const section = (title: string) => `<section>${title}</section>`

// #region usage
export const Playground = {
  render: () => ({
    template: `
      <div>${section('a')}</div>
    `,
  }),
}
// #endregion
