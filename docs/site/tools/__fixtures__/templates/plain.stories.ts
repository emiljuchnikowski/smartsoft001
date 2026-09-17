// #region usage
export const Playground = {
  render: () => ({
    props: { label: 'Save' },
    template: `
      <div style="padding: 40px;">
        <smart-button-preset [options]="options">
          {{ label }}
        </smart-button-preset>
      </div>
    `,
  }),
}
// #endregion
