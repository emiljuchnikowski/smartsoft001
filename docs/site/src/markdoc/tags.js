import { Callout } from '@/components/Callout'
import { QuickLink, QuickLinks } from '@/components/QuickLinks'
import { Storybook } from '@/components/Storybook'
import { Tab, Tabs } from '@/components/Tabs'

const tags = {
  callout: {
    attributes: {
      title: { type: String },
      type: {
        type: String,
        default: 'note',
        matches: ['note', 'warning'],
        errorLevel: 'critical',
      },
    },
    render: Callout,
  },
  figure: {
    selfClosing: true,
    attributes: {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
    },
    render: ({ src, alt = '', caption }) => (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
      </figure>
    ),
  },
  storybook: {
    selfClosing: true,
    attributes: {
      project: { type: String, required: true },
      story: { type: String, required: true },
      height: { type: Number, default: 320 },
    },
    render: Storybook,
  },
  tabs: {
    render: Tabs,
  },
  tab: {
    render: Tab,
    attributes: {
      title: { type: String, required: true },
    },
  },
  'quick-links': {
    render: QuickLinks,
  },
  'quick-link': {
    selfClosing: true,
    render: QuickLink,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      href: { type: String },
    },
  },
}

export default tags
