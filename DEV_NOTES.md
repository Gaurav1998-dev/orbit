Orbit
- Feature- for post clarify what kind of media attachment that post has: **Check the **`attachments`** field in the tweet object.** If present with `media_keys`, use `expansions=attachments.media_keys` and `media.fields=type`. Media `type` is "photo", "video", or "animated_gif".

- System design consideration- what if two different users request analysis for same xUser at around the same time?

- Feature- make app multi-tenant so different teams can see what analyses their coworkers are running