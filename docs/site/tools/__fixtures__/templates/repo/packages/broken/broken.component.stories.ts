const cell = (label: string) => `<td>${label}</td>`

// #region usage
export const Playground = {
  render: () => ({
    template: `
      <tr>${cell('one')}</tr>
    `,
  }),
}
// #endregion
