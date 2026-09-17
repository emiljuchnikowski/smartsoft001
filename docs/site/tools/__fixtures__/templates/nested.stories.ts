const SIZE = 'lg'

// #region usage
export const Playground = {
  render: () => ({
    template: `
      <div class="${['box', `pad-${SIZE}`].join(' ')}">
        <smart-x [options]="options"></smart-x>
      </div>
    `,
  }),
}
// #endregion
