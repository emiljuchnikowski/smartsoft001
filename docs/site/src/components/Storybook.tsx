const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * Embeds a single story of a Storybook build published next to the docs
 * (see the `storybook/<project>` folders of the deployed site).
 */
export function Storybook({
  project,
  story,
  height = 320,
}: {
  project: string
  story: string
  height?: number
}) {
  return (
    <iframe
      src={`${base}/storybook/${project}/iframe.html?id=${story}&viewMode=story`}
      title={story}
      loading="lazy"
      height={height}
      className="w-full rounded-lg border border-slate-200 dark:border-slate-800"
    />
  )
}
