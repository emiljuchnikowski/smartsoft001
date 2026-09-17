const IMAGE_URL = 'https://example.com/photo.jpg'

const SLOTS = `
  <ng-template #image>
    <img src="${IMAGE_URL}" alt="" />
  </ng-template>
`

// #region usage
export const Playground = {
  render: () => ({
    template: `
      ${SLOTS}
      <div style="padding: 40px;">
        <smart-section-heading [options]="options" />
      </div>
    `,
  }),
}
// #endregion
