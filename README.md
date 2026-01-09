# (frontend) hero rays
hero rays was used using react bits component library.

# (frontend) implementing posthog for analytics
implement posthog right after creating the first component may be the hero. so that you can develop and track from the very first moment

npx -y @posthog/wizard@latest

then create a providers.tsx in the app directory

and then wrap the root layout.tsx file with the provider

you can also manually trigger events

Optional: Send a manual event
If you'd like, you can manually define events, too.

posthog.capture('my event', { property: 'value' })