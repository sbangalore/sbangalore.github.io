# Markets atlas sourcing

The atlas is a reviewed market map, not a live news feed. Automated collectors write only to `.atlas/candidate_inbox.json`; that file is not loaded by the site.

## Evidence hierarchy

1. Primary institutional evidence: regulators, exchange rulebooks, official product documentation, filings, and release notes.
2. Research evidence: papers and working papers discovered through durable indexes, then checked at the publisher or repository.
3. Commercial evidence: official funding, acquisition, partnership, customer, and product announcements.
4. Usage evidence: repository activity, package adoption, volumes, and benchmark use.
5. Discovery leads: curated X accounts, newsletters, and publications. These can suggest a question but cannot establish a public claim alone.

## Promotion contract

Every new or materially changed public claim should include:

- a source URL;
- the date the source was observed;
- a source class;
- whether the source is primary or corroborating;
- the specific atlas implication;
- a confidence assessment when interpretation is involved.

Entity facts should be supported by primary evidence. Literature signals should link to the paper. Market-structure scores and unbuilt opportunities require at least one primary or research source plus an explicit explanation of the inference.

The source registry is [`sources.json`](sources.json). It defines collection endpoints, product lanes, authority, and promotion policy. The Monday workflow opens or updates a review PR; publication remains a separate decision.
