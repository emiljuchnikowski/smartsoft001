/** The menu items that toggle a format of the selection. */
export type SmartRichTextToggle =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'blockquote'
  | 'ordered_list'
  | 'bullet_list'
  | 'align_left'
  | 'align_center'
  | 'align_right'
  | 'align_justify';

export type SmartRichTextHeading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type SmartRichTextColorKind = 'text_color' | 'background_color';

/** A menu item. */
export type SmartRichTextToolbarItem =
  | SmartRichTextToggle
  | SmartRichTextColorKind
  | 'link'
  | 'image'
  | { heading: SmartRichTextHeading[] };

/** Groups of menu items, separated in the menu bar. */
export type SmartRichTextToolbar = SmartRichTextToolbarItem[][];

/** The menu of the long-text field. */
export const LONG_TEXT_TOOLBAR: SmartRichTextToolbar = [
  ['bold', 'italic'],
  ['underline', 'strike'],
  ['code', 'blockquote'],
  ['ordered_list', 'bullet_list'],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ['link', 'image'],
  ['text_color', 'background_color'],
  ['align_left', 'align_center', 'align_right', 'align_justify'],
];

/** The texts of the menu, in English (they are not translation keys). */
export const RICH_TEXT_LABELS = {
  bold: 'Bold',
  italic: 'Italic',
  code: 'Code',
  underline: 'Underline',
  strike: 'Strike',
  blockquote: 'Blockquote',
  bullet_list: 'Bullet List',
  ordered_list: 'Ordered List',
  heading: 'Heading',
  h1: 'Header 1',
  h2: 'Header 2',
  h3: 'Header 3',
  h4: 'Header 4',
  h5: 'Header 5',
  h6: 'Header 6',
  align_left: 'Left Align',
  align_center: 'Center Align',
  align_right: 'Right Align',
  align_justify: 'Justify',
  text_color: 'Text Color',
  background_color: 'Background Color',
  insertLink: 'Insert Link',
  removeLink: 'Remove Link',
  insertImage: 'Insert Image',
  url: 'URL',
  text: 'Text',
  openInNewTab: 'Open in new tab',
  insert: 'Insert',
  altText: 'Alt Text',
  title: 'Title',
  remove: 'Remove',
  enterValidUrl: 'Please enter a valid URL',
  required: 'This is required',
} as const;

const URL_PATTERN =
  '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/??([^#\\n\\r]*)?#?([^\\n\\r]*)';

/**
 * The URLs the link form accepts, matched whole: the anchors cover the whole
 * alternation, not only its ends, so a `javascript:` URL ending in a `mailto:`
 * part does not get through.
 */
export const RICH_TEXT_LINK_PATTERN = new RegExp(
  `^(?:${URL_PATTERN}|(mailto:.*[@].*))$`,
);

/** The URLs the image form accepts. */
export const RICH_TEXT_IMAGE_PATTERN = new RegExp(`^(?:${URL_PATTERN})$`);

/** The colour presets, shown in rows of 8. */
export const RICH_TEXT_COLOR_PRESETS = [
  '#b60205',
  '#d93f0b',
  '#fbca04',
  '#0e8a16',
  '#006b75',
  '#1d76db',
  '#0052cc',
  '#5319e7',
  '#e99695',
  '#f9d0c4',
  '#fef2c0',
  '#c2e0c6',
  '#bfdadc',
  '#c5def5',
  '#bfd4f2',
  '#d4c5f9',
];

export type SmartRichTextIconName =
  | SmartRichTextToggle
  | 'link'
  | 'unlink'
  | 'image'
  | 'text_color'
  | 'color_fill';

/** The paths of the menu (Material) icons, on a 24x24 view box. */
export const RICH_TEXT_ICONS: Record<SmartRichTextIconName, string[]> = {
  bold: [
    'M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z',
  ],
  italic: ['M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z'],
  code: [
    'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
  ],
  underline: [
    'M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z',
  ],
  strike: [
    'M6.85,7.08C6.85,4.37,9.45,3,12.24,3c1.64,0,3,0.49,3.9,1.28c0.77,0.65,1.46,1.73,1.46,3.24h-3.01 c0-0.31-0.05-0.59-0.15-0.85c-0.29-0.86-1.2-1.28-2.25-1.28c-1.86,0-2.34,1.02-2.34,1.7c0,0.48,0.25,0.88,0.74,1.21 C10.97,8.55,11.36,8.78,12,9H7.39C7.18,8.66,6.85,8.11,6.85,7.08z M21,12v-2H3v2h9.62c1.15,0.45,1.96,0.75,1.96,1.97 c0,1-0.81,1.67-2.28,1.67c-1.54,0-2.93-0.54-2.93-2.51H6.4c0,0.55,0.08,1.13,0.24,1.58c0.81,2.29,3.29,3.3,5.67,3.3 c2.27,0,5.3-0.89,5.3-4.05c0-0.3-0.01-1.16-0.48-1.94H21V12z',
  ],
  ordered_list: [
    'M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z',
  ],
  bullet_list: [
    'M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z',
  ],
  blockquote: ['M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z'],
  link: [
    'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
  ],
  unlink: [
    'M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z',
  ],
  image: [
    'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  ],
  align_left: [
    'M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z',
  ],
  align_center: [
    'M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z',
  ],
  align_right: [
    'M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z',
  ],
  align_justify: [
    'M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z',
  ],
  text_color: [
    'M2,20h20v4H2V20z M5.49,17h2.42l1.27-3.58h5.65L16.09,17h2.42L13.25,3h-2.5L5.49,17z M9.91,11.39l2.03-5.79h0.12l2.03,5.79 H9.91z',
  ],
  color_fill: [
    'M16.56,8.94L7.62,0L6.21,1.41l2.38,2.38L3.44,8.94c-0.59,0.59-0.59,1.54,0,2.12l5.5,5.5C9.23,16.85,9.62,17,10,17 s0.77-0.15,1.06-0.44l5.5-5.5C17.15,10.48,17.15,9.53,16.56,8.94z M5.21,10L10,5.21L14.79,10H5.21z M19,11.5c0,0-2,2.17-2,3.5 c0,1.1,0.9,2,2,2s2-0.9,2-2C21,13.67,19,11.5,19,11.5z M2,20h20v4H2V20z',
  ],
};
