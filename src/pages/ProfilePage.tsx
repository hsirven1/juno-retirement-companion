import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '../components/Container'
import { Button } from '../components/Button'
import { useApp } from '../context/useApp'
import { buildSocialProfileSummary, useCopy, useLocale } from '../i18n'

export function ProfilePage() {
  const navigate = useNavigate()
  const { profile, socialPreferences, pathProgress } = useApp()
  const copy = useCopy()
  const { locale } = useLocale()
  const [situation, setSituation] = useState(profile.situation)
  const [seeking, setSeeking] = useState(profile.seeking)
  const [interests, setInterests] = useState(profile.interests)
  const [preferences, setPreferences] = useState(profile.preferences)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  // Keep editable fields in sync when path answers update the profile
  const liveSeeking = editing === 'seeking' ? seeking : profile.seeking
  const liveInterests = editing === 'interests' ? interests : profile.interests
  const livePreferences =
    editing === 'preferences' ? preferences : profile.preferences

  const socialSummary = buildSocialProfileSummary(socialPreferences, locale)
  const socialStarted =
    (pathProgress['path-social']?.completedStepIds.length ?? 0) > 0

  function startEdit(section: string, value: string) {
    setEditing(section)
    setDraft(value)
  }

  function saveEdit() {
    if (!editing) return
    const parts = draft
      .split(/[·,]/)
      .map((part) => part.trim())
      .filter(Boolean)

    if (editing === 'seeking') setSeeking(parts)
    if (editing === 'interests') setInterests(parts)
    if (editing === 'preferences') setPreferences(parts)
    if (editing === 'role') {
      setSituation((current) => ({ ...current, formerRole: draft.trim() }))
    }
    setEditing(null)
  }

  return (
    <Container width="reading" className="py-12 sm:py-16">
      <h1 className="font-display text-[2.3rem] font-medium tracking-[-0.02em] text-ink sm:text-[2.7rem]">
        {copy.profile.title}
      </h1>
      <p className="mt-4 max-w-[36rem] text-[18px] text-ink-muted">
        {copy.profile.subtitle}
      </p>

      <section className="mt-12">
        <SectionHeader
          title={copy.profile.situation}
          onEdit={() => startEdit('role', situation.formerRole)}
        />
        <dl className="mt-5 space-y-2 text-[18px] text-ink">
          <dd>{situation.retiredDate}</dd>
          <dd>{situation.location}</dd>
          {editing === 'role' ? (
            <EditableField
              value={draft}
              onChange={setDraft}
              onSave={saveEdit}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <dd>{situation.formerRole}</dd>
          )}
        </dl>
      </section>

      <ProfileListSection
        title={copy.profile.seeking}
        items={liveSeeking}
        editing={editing === 'seeking'}
        draft={draft}
        onEdit={() => startEdit('seeking', liveSeeking.join(' · '))}
        onChange={setDraft}
        onSave={saveEdit}
        onCancel={() => setEditing(null)}
      />

      <ProfileListSection
        title={copy.profile.interests}
        items={liveInterests}
        editing={editing === 'interests'}
        draft={draft}
        onEdit={() => startEdit('interests', liveInterests.join(' · '))}
        onChange={setDraft}
        onSave={saveEdit}
        onCancel={() => setEditing(null)}
      />

      <ProfileListSection
        title={copy.profile.preferences}
        items={livePreferences}
        editing={editing === 'preferences'}
        draft={draft}
        onEdit={() => startEdit('preferences', livePreferences.join(' · '))}
        onChange={setDraft}
        onSave={saveEdit}
        onCancel={() => setEditing(null)}
      />

      {socialStarted ? (
        <section className="mt-14 border-t border-line pt-12">
          <SectionHeader
            title={copy.profile.socialLife}
            onEdit={() => void navigate('/plan')}
          />
          <ul className="mt-5 space-y-3 text-[18px] text-ink-muted">
            {socialSummary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-14 border-t border-line pt-12">
        <h2 className="text-[13px] font-medium tracking-[0.16em] text-ink-soft uppercase">
          {copy.profile.learnings}
        </h2>
        <ul className="mt-6 space-y-4">
          {profile.learnings.map((learning) => (
            <li key={learning} className="max-w-[36rem] text-[18px] text-ink-muted">
              {learning}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 border-t border-line pt-12">
        <h2 className="text-[13px] font-medium tracking-[0.16em] text-ink-soft uppercase">
          {copy.profile.vision}
        </h2>
        <blockquote className="mt-5 font-display text-[1.55rem] leading-snug text-ink">
          {copy.profile.quote(profile.vision)}
        </blockquote>
      </section>

      <div className="mt-14">
        <Button to="/retirement-map" variant="secondary">
          {copy.profile.updateMap}
        </Button>
      </div>
    </Container>
  )
}

function SectionHeader({
  title,
  onEdit,
}: {
  title: string
  onEdit: () => void
}) {
  const copy = useCopy()

  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-[13px] font-medium tracking-[0.16em] text-ink-soft uppercase">
        {title}
      </h2>
      <button
        type="button"
        onClick={onEdit}
        className="cursor-pointer text-[14px] text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
      >
        {copy.profile.edit}
      </button>
    </div>
  )
}

function ProfileListSection({
  title,
  items,
  editing,
  draft,
  onEdit,
  onChange,
  onSave,
  onCancel,
}: {
  title: string
  items: string[]
  editing: boolean
  draft: string
  onEdit: () => void
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <section className="mt-14 border-t border-line pt-12">
      <SectionHeader title={title} onEdit={onEdit} />
      {editing ? (
        <div className="mt-5">
          <EditableField
            value={draft}
            onChange={onChange}
            onSave={onSave}
            onCancel={onCancel}
          />
        </div>
      ) : (
        <p className="mt-5 text-[18px] text-ink">{items.join(' · ')}</p>
      )}
    </section>
  )
}

function EditableField({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
}) {
  const copy = useCopy()

  return (
    <div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-line-strong bg-paper px-4 py-3 text-[17px] text-ink"
      />
      <div className="mt-3 flex gap-3">
        <Button className="min-h-11 px-5 text-[16px]" onClick={onSave}>
          {copy.profile.save}
        </Button>
        <Button
          variant="ghost"
          className="min-h-11 px-4 text-[16px]"
          onClick={onCancel}
        >
          {copy.profile.cancel}
        </Button>
      </div>
    </div>
  )
}
