# CRUD Migration — Parity Audit & Gap Register (FRA-293, Phase 0)

> **Definition of done for FRA-293.** Every file, export, component, service and **behavior**
> in the old `smartsoft/libs/crud` must have a fully-implemented equivalent in
> `@smartsoft001/crud-shell-angular`. Nothing is removed without an implemented replacement
> or a justified entry below. Commented-out / placeholder code does **not** count as transferred.
>
> The migration is exhaustively complete only when every `OPEN` row here is resolved.

**Sources compared**

- OLD: `smartsoft/libs/crud` (Ionic)
- NEW: `smartsoft001-fork/packages/crud` (Tailwind / signals)

**Status legend**

- ✅ **Ported** — present in NEW (a signals/Promise refactor with identical behavior counts as ported).
- ⚠️ **Partial** — logic exists in NEW but the UI/template is a commented-out placeholder, or behavior subtly changed.
- ❌ **Dropped** — file / export / behavior absent in NEW with no replacement.

---

## Tier overview

| Tier                 | File parity             | Behavior parity                | Verdict                    |
| -------------------- | ----------------------- | ------------------------------ | -------------------------- |
| `domain`             | ✅ identical/equivalent | ✅                             | **Complete** — audit only  |
| `shell/dtos`         | ✅                      | ✅                             | **Complete** — audit only  |
| `shell/nestjs`       | ✅ (+ added specs)      | ✅ all methods/exports present | **Complete** — audit only  |
| `shell/app-services` | ✅ (+ added spec)       | ✅ all methods present         | **Complete** — audit only  |
| `shell/angular`      | ✅ files (−1 dropped)   | ⚠️ extensive UI + logic gaps   | **Major work** — see below |

Backend tiers verified by symbol/method/export comparison: every exported class, interface,
function and public method in OLD is present in NEW. Differences are formatting and import
modernization only. **No backend drops.**

The entire remaining migration effort is in `shell/angular`.

---

## A. Dropped / missing files

| ID     | Artifact                            | Status     | Required action                                                                                                                                                                                                                                                                     | Phase |
| ------ | ----------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| GAP-01 | `services/socket/socket.service.ts` | ❌ Dropped | Restore **1:1 as it was**. ⚠️ The OLD file was an **inert stub**: `SocketService<T>` and `NotSocketService<T>` are both empty `@Injectable()` classes with all websocket code commented out. 1:1 restore = re-create the two empty injectables (no real realtime behavior to port). | 1     |

---

## B. Public API / module wiring drift

| ID     | Artifact                                                                                | Status      | Required action                                                                                                                                                          | Phase |
| ------ | --------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| GAP-02 | `+state/index.ts` — `crud.actions` not re-exported                                      | ❌ Dropped  | Re-export `crud.actions` (OLD `index.ts` exported it; all action creators are no longer public).                                                                         | 1     |
| GAP-03 | `+state/index.ts` — `crud.effects` not re-exported                                      | ❌ Dropped  | Re-export `crud.effects` / `CrudEffects` (OLD exported it).                                                                                                              | 1     |
| GAP-04 | `crud.module.ts` `forFeature` — socket conditional provider                             | ❌ Dropped  | Restore `options.socket ? [SocketService] : [{ provide: SocketService, useClass: NotSocketService }]`. Depends on GAP-01.                                                | 1     |
| GAP-05 | `SocketService` provider (components.module / crud.module / crud-full.module)           | ❌ Dropped  | Restore provider wiring consistent with GAP-01/04, incl. `@Optional() socket` injection in `CrudService`.                                                                | 1     |
| GAP-06 | `socket?: boolean` on `ICrudModuleOptionsWith/WithoutRoutng`                            | ⚠️ Orphaned | Currently a dead no-op. Reconcile with GAP-04 so the flag drives the provider again.                                                                                     | 1     |
| GAP-07 | `StoreModule` / `NgrxSharedModule` imports removed (`CrudCoreModule`, `CrudFullModule`) | ⚠️ Verify   | Reducer registration still happens via `NgrxStoreService.addReducer`. **Verify** this is an intentional consolidation; if so, record as justified-removal; else restore. | 1     |

---

## C. `shell/angular` — component / template behavior gaps

> Cross-cutting cause: in nearly every component the Ionic markup was **commented out with
> no Tailwind replacement**. Control-flow scaffolding (`@if`/`@for`) is in place, so most
> rows below are "re-template", but several are genuine logic regressions (flagged 🔴).

### C1. Filter field components

| ID        | Component                                   | Missing behavior(s)                                                                                                                                                              | Status   | Phase |
| --------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----- |
| GAP-10    | `filter/text`                               | Text input (`[(ngModel)]="value"`); clear button                                                                                                                                 | ⚠️       | 3     |
| GAP-11    | `filter/int`                                | Numeric input; advanced min/max inputs; advanced toggle (icon swap); clear + per-field clear buttons                                                                             | ⚠️       | 3     |
| GAP-12    | `filter/check`                              | Per-entry checkbox list (renders labels only); clear-all button; divider                                                                                                         | ⚠️       | 3     |
| GAP-13    | `filter/radio`                              | Radio group binding; per-option radio inputs **and option labels**; clear button                                                                                                 | ⚠️       | 3     |
| GAP-14    | `filter/flag`                               | Flag checkbox/toggle; clear button (note: `flag-container` already Tailwind)                                                                                                     | ⚠️       | 3     |
| GAP-15    | `filter/date`                               | Clickable trigger; date popover + picker; clear button                                                                                                                           | ⚠️       | 3     |
| GAP-16    | `filter/date-time`                          | "from"/"to" datetime inputs (with validation pattern); clear + per-field clear                                                                                                   | ⚠️       | 3     |
| GAP-17    | `filter/date-with-edit`                     | Date text input; calendar popover/picker (locale, first-day-of-week); advanced min/max inputs; advanced toggle; clear + per-field clear                                          | ⚠️       | 3     |
| GAP-18 🔴 | `filter/base`                               | `initPossibilities` dropped the `CRUD_MODEL_POSSIBILITIES_PROVIDER` + `CrudConfig.type` override path (now only reads `item.possibilities`).                                     | ⚠️ logic | 2     |
| GAP-19 🔴 | `filter/check`                              | `computed` list no longer depends on `facade.filter()` (OLD `combineLatest` included `filter$`) — recompute trigger differs.                                                     | ⚠️ logic | 3     |
| GAP-20 🔴 | `filter/date-time`, `filter/date-with-edit` | `IonDatetime` `@ViewChild` + `ionChange` subscription commented out in **TS**; `_subscriptions` never populated → picker change handler is dead. Re-wire to the new date picker. | ⚠️ logic | 3     |

### C2. Container components

| ID        | Component         | Missing behavior(s)                                                                                                                                                                                                         | Status   | Phase |
| --------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----- |
| GAP-21    | `filters` (panel) | Header toolbar; panel title; close button (logic exists, unbound); scroll container (`ion-content` 100vh / `ion-list`); `hideMenu` host is dead                                                                             | ⚠️       | 3     |
| GAP-22 🔴 | `filters-config`  | Chip UI (renders bare text); leading/trailing icons; **`onRemoveQuery` is unreachable** — no element binds the click (core remove-active-filter behavior broken). Use `smart-badge` dismissible.                            | ⚠️       | 3     |
| GAP-23 🔴 | `group`           | Accordion replaced by a bare clickable `<div>` placeholder. No header/body, no two-way `[(show)]`, no active-header styling. **Depends on a free accordion** — `AccordionComponent` was moved to pro (FRA-101). See GAP-30. | ⚠️       | 3     |
| GAP-24 🔴 | `group`           | OLD open-path `setTimeout` deferral + explicit `cd.detectChanges()` dropped (`ChangeDetectorRef` no longer injected). Verify expand still renders correctly without it.                                                     | ⚠️ logic | 3     |
| GAP-25    | `multiselect`     | Header toolbar chrome (title text survives bare); close button unbound (`onClose` unreachable)                                                                                                                              | ⚠️       | 3     |
| GAP-26 🔴 | `export`          | Post-export popover **auto-close-on-completion broken**: OLD subscribed to `loaded$` then closed; NEW does a one-shot synchronous `loading()` check → closes immediately / never reacts to completion.                      | ⚠️ logic | 3     |

### C3. Page components

| ID        | Component                   | Missing behavior(s)                                                                                                                                                                                                                                 | Status | Phase |
| --------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| GAP-27 🔴 | `pages/list/list.component` | `<smart-page>` wrapper **commented out** (`PageComponent` not imported) → page **title**, **search bar**, and all **end/header buttons** (multi / filters / add / export / custom `config.buttons`) computed in TS but never rendered or clickable. | ⚠️     | 3     |
| GAP-28 🔴 | `pages/item/item.component` | `<smart-page>` wrapper commented out (`// PageComponent`) → **title** (create/update/details), mode action buttons (**add / save / cancel / edit**), **back button**, menu-button suppression all computed but not rendered.                        | ⚠️     | 3     |
| GAP-29    | `pages/item/item.component` | `IonContent` `@ViewChild` removed behind `//TODO: rewrite when rewriting ionic`; `content` reference absent. Re-introduce scroll/content handle if still needed.                                                                                    | ⚠️     | 3     |

> `pages/list/base`, `pages/list/standard`, `pages/item/base`, `pages/item/standard` are **clean refactors — no gaps.**

### C4. Cross-cutting dependency

| ID        | Item                                          | Status   | Required action                                                                                                                                                                                                                                                                                                                                                                                                                                             | Phase |
| --------- | --------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| GAP-30 ✅ | Free **accordion** needed by `group` (GAP-23) | Decision | **DECIDED (Phase 2):** `AccordionComponent` stays in pro (FRA-101). Free CRUD `group` uses a **minimal accessible HTML disclosure** (button + region, `aria-expanded`/`aria-controls`, two-way `show`), styled with Tailwind `smart:` prefix — HTML-template-first per FRA-203 free-tier policy, OnPush-safe. Pro overrides with rich `smartpro-accordion` via the base+token pattern. Implementation of the disclosure template lands in GAP-23 (Phase 3). | 2/3   |

---

## D. State / services / support — logic gaps

| ID        | Artifact                                                  | Status      | Required action                                                                                                                                                                                                                                                      | Phase |
| --------- | --------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| GAP-31 🔴 | `pipes/form-options` provider injection                   | ⚠️          | Injection is no longer `@Optional()` (`inject(CRUD_MODEL_POSSIBILITIES_PROVIDER)` without `{ optional: true }`) → throws when token unprovided (OLD injected `null`). Restore optionality.                                                                           | 1     |
| GAP-32 ✅ | `factories/list-pagination` `loadNextPage`/`loadPrevPage` | ✅ Ported   | **FIXED (Phase 2):** await-on-load restored via `toObservable(facade.loaded, { injector }).pipe(filter(l => !!l), take(1))` — resolves only after the read completes; `take(1)` also closes the OLD subscription leak. Covered by `list-pagination.factory.spec.ts`. | 2     |
| GAP-33    | `factories/list-pagination` `page$`/`totalPages$`         | ⚠️ refactor | Replaced by `page`/`totalPages` signals — shape change of returned `IListPaginationOptions`. Accept as intentional; ensure consumers updated.                                                                                                                        | —     |
| GAP-34    | `services/list-group` `change(...)` signature             | ⚠️ refactor | Lost the (unused) 3rd `groups` param. Behavior unchanged; update callers. Accept as intentional.                                                                                                                                                                     | —     |
| GAP-35    | `CrudFacade` `*$` Observables + mutable props             | ⚠️ refactor | All `*$` streams and mutable `selected/multiSelected/list/filter` replaced by signals. Intentional; data parity intact. Record as accepted breaking-API.                                                                                                             | —     |

`+state` actions / reducer / selectors / effects, and `crud`/`page`/`search` services, `crud.config`,
`model-possibilities` provider, and `form-options.transform` logic are at **full parity** (modulo the
signals/Promise refactor) — no logic gaps beyond the rows above.

---

## E. Accepted / justified removals (no action)

- **Socket realtime behavior** — never existed as live code in OLD (inert stub). Only the stub
  classes + DI plumbing are restored (GAP-01/04/05). Real websocket functionality is explicitly
  out of FRA-290 scope.
- **RxJS → signals / Observable → Promise** refactors across facade, services, factory — intentional
  modernization; behavior preserved (GAP-33/34/35).

---

## F. Definition-of-done checklist (consolidated)

Resolve every row, then this register is closed and FRA-293 functional parity is achieved.

- [x] GAP-01 restore socket stub · [x] GAP-02 export actions · [x] GAP-03 export effects ✅ Phase 1
- [x] GAP-04 socket conditional provider · [x] GAP-05 SocketService wiring · [x] GAP-06 reconcile `socket?` flag ✅ Phase 1
- [~] GAP-07 Store/Ngrx module removal — compiles after Phase 1; mechanism `NgrxStoreService.addReducer` preserved. Provisionally accepted as intentional consolidation; **confirm reducer registration at runtime in a consuming app** before closing.
- [~] GAP-10..17 filter field templates — **architecture (decided 2026-06-05): reuse shared `smart-input-*` components, computed-signal reads, OnPush** (see `project_crud_filter_architecture` memory).
  - [x] GAP-10 text → `smart-input-text` ✅ · [x] GAP-14 flag → `smart-input-flag` ✅ · [x] GAP-13 radio → `smart-input-radio` (+ possibilities bridge) ✅ (all OnPush)
  - [x] GAP-11 int → `smart-input-int` (primary value) + native Tailwind from/to range inputs for advanced min/max (smart-input always renders the _model_ label, so range uses native "from"/"to") ✅
  - [x] GAP-12 check → native Tailwind checkbox list (OnPush; `smart-input-check` shape-incompatible with the filter's scalar-id + array value) ✅
  - [x] GAP-15 date → `smart-date-edit` (`[ngModel]="customValue"`) ✅ · [x] GAP-17 date-with-edit → `smart-date-edit` + advanced from/to ✅ · [x] GAP-16 date-time → native `<input type="datetime-local">` from/to (OLD was a time-of-day range, no `smart-date-edit` date-only fit) ✅
  - **✅ ALL 8 filter widgets migrated** (text/flag/radio/int/check/date/date-time/date-with-edit) — Tailwind `smart:`, OnPush, smart-input/smart-date-edit reuse where it fits (native for check list, int/date range labels). GAP-10..17 + **GAP-20** done.
  - **GAP-19 (substantially done):** all clear/visibility conditionals now OnPush-safe computed signals (`hasValue`/`hasMinValue`/`hasMaxValue`); inputs bound via `bindControl(type)` FormControl bridge. Legacy `value`/`min`/`max` getters/setters retained as internal write helpers (used by check `onCheckChange` and date `customValue` moment-format setters) — full removal is a low-value follow-up; `// TODO(GAP-19)` notes mark external-filter→picker re-sync.
  - ✅ **Shared fix (made radio/check robust):** `InputPossibilitiesBaseComponent` now injects `MODEL_POSSIBILITIES_PROVIDER` with `{ optional: true }` (it already tolerates a null provider internally) — `smart-input-radio`/`-check` no longer NullInjectorError when no app provides the token; filters supply possibilities via `options.possibilities`. (Same class of fix as the `ModelLabelPipe` NG0602 fix.)
  - ✅ **RISK RESOLVED (both fixes, decided 2026-06-05):** (a) shared `ModelLabelPipe` fixed — `transform` returns `translateService.instant('MODEL.'+key)` directly (no `toSignal` in reactive context → NG0602 gone); (b) CRUD ships `CrudModelLabelProvider` (delegates to an app-level `IModelLabelProvider` via `skipSelf`, else translates `MODEL.<key>`), registered in `CrudCoreModule` + `CrudComponentsModule`. Shared `angular` suite 1719 ✅, crud 84 ✅.
- [x] GAP-18 possibilities-provider override ✅ Phase 2 · [~] GAP-19 `filter()`/value reactivity → computed signals (substantially done; legacy getters retained as write helpers) · [x] GAP-20 datetime picker wiring ✅ Phase 3
- [x] GAP-21 filters panel ✅ Phase 3 (Tailwind header/close/title + scroll list, OnPush; dispatcher comments cleaned) · [x] GAP-22 filters-config chips + remove ✅ Phase 3 (🔴 fixed — Tailwind clickable chip buttons, `onRemoveQuery` reachable again, OnPush) · [x] GAP-23 group accordion ✅ Phase 3 (Tailwind HTML disclosure per GAP-30 — button + `aria-expanded`/`aria-controls` + region; pro keeps `smartpro-accordion`) · [x] GAP-24 group CD deferral ✅ Phase 3 (restored `setTimeout`-on-open + `cd.detectChanges()`, OnPush)
- [x] GAP-25 multiselect header/close ✅ Phase 3 (Tailwind header — `selected: N` title + close button, OnPush) · [ ] GAP-26 export popover auto-close
- [ ] GAP-27 list `<smart-page>` · [ ] GAP-28 item `<smart-page>` · [ ] GAP-29 item IonContent
- [x] GAP-30 free accordion decision — DECIDED Phase 2 (HTML disclosure in free; pro keeps `smartpro-accordion`); template impl in GAP-23 (Phase 3) ✅
- [x] GAP-31 form-options optional injection ✅ Phase 2 · [x] GAP-32 pagination await-on-load ✅ Phase 2
- [ ] GAP-33/34/35 confirm accepted refactors documented

### Phase 2 additions (beyond parity)

- [x] **Declarative styling surface** — `CrudFullConfig.cssClass?` / `CrudFullConfig.variant?` added (tier-2 styling, OnPush-safe, additive). Deep threading into shared `IListOptions`/`IPageOptions` is deferred to Phase 3 (cross-package change in `@smartsoft001/angular`, lands with the restored `<smart-page>` wrapper — GAP-27/28). ✅ Phase 2
- [x] **Thin base-class extraction** — `@Directive()` bases extracted (logic only, zero behavior change, guarded by characterization tests): `ExportBaseComponent`, `MultiselectBaseComponent`, `FiltersBaseComponent`, `GroupBaseComponent` (+ existing filter `BaseComponent`). Concretes now `extends` their base; selectors/call-sites/templates unchanged; bases exported from the barrel so FRA-294 (pro) can extend them. CD strategy left default with a `TODO(Tor A / Phase 3)` to author OnPush-safe when templates are rebuilt. ✅ Phase 2

🔴 = genuine behavior regression (not just missing chrome) — prioritize.

---

_Generated for FRA-293 Phase 0 (Parity Audit). Backend tiers verified by symbol diff; `shell/angular` verified by full old↔new behavioral comparison._
