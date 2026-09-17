const BOX_CLASS = [
  'smart:rounded-lg',
  'smart:border',
  'smart:border-gray-300',
  'smart:bg-white',
].join(' ')

const KEYS = ['name', 'role'].join()

// #region usage
export const Playground = {
  render: () => ({
    template: `
      <div class="${BOX_CLASS}" data-keys="${KEYS}"></div>
    `,
  }),
}
// #endregion
