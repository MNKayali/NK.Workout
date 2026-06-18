import { useNavigate } from 'react-router-dom'
import { useWorkout } from '../store/WorkoutContext.jsx'
import { bmi, bmiLabel, bmr } from '../lib/calories.js'
import Card from '../components/Card.jsx'

function NumField({ label, value, onChange, unit, min, max, step = 1, inputMode = 'numeric' }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode={inputMode}
          value={value ?? ''}
          min={min}
          max={max}
          step={step}
          onChange={(e) =>
            onChange(e.target.value === '' ? undefined : Number(e.target.value))
          }
          className="w-20 rounded-xl bg-canvas px-3 py-1.5 text-right text-sm font-bold tabular-nums focus:outline-none"
          placeholder="—"
        />
        {unit && <span className="w-7 text-xs text-ink-soft">{unit}</span>}
      </div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { profile, setProfile } = useWorkout()

  const bmiVal = bmi(profile)
  const bmrVal = bmr(profile)

  return (
    <div className="px-4 pt-5 pb-8">
      <button onClick={() => navigate(-1)} className="mb-3 text-sm font-semibold text-blue">
        ‹ Back
      </button>
      <h1 className="mb-5 text-[28px] font-extrabold">Profile</h1>

      <Card className="mb-4 divide-y divide-hairline px-4">
        <NumField
          label="Weight"
          value={profile.weightKg}
          onChange={(v) => setProfile({ weightKg: v })}
          unit="kg"
          min={20}
          max={300}
          step={0.5}
          inputMode="decimal"
        />
        <NumField
          label="Height"
          value={profile.heightCm}
          onChange={(v) => setProfile({ heightCm: v })}
          unit="cm"
          min={100}
          max={250}
        />
        <NumField
          label="Age"
          value={profile.age}
          onChange={(v) => setProfile({ age: v })}
          unit="yrs"
          min={13}
          max={120}
        />
        <div className="flex items-center justify-between py-3.5">
          <span className="text-sm font-medium">Sex</span>
          <div className="flex gap-1 rounded-xl bg-canvas p-1">
            {['male', 'female'].map((s) => (
              <button
                key={s}
                onClick={() => setProfile({ sex: s })}
                style={profile.sex === s ? { background: 'var(--color-blue)', color: 'white' } : {}}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  profile.sex === s ? 'shadow-sm' : 'text-ink-soft'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {(bmiVal != null || bmrVal != null) && (
        <Card className="flex divide-x divide-hairline mb-4">
          {bmiVal != null && (
            <div className="flex-1 px-2 py-3 text-center">
              <div className="text-[26px] font-extrabold leading-none" style={{ color: 'var(--color-blue)' }}>
                {bmiVal}
              </div>
              <div className="mt-1 text-[11px] font-medium text-ink-soft">BMI</div>
              <div className="text-[10px] text-ink-soft/70">{bmiLabel(bmiVal)}</div>
            </div>
          )}
          {bmrVal != null && (
            <div className="flex-1 px-2 py-3 text-center">
              <div className="text-[26px] font-extrabold leading-none" style={{ color: 'var(--color-green)' }}>
                {bmrVal}
              </div>
              <div className="mt-1 text-[11px] font-medium text-ink-soft">BMR</div>
              <div className="text-[10px] text-ink-soft/70">kcal / day</div>
            </div>
          )}
        </Card>
      )}

      <p className="text-center text-xs text-ink-soft">
        Used for calorie estimates. Stored only on this device.
      </p>
    </div>
  )
}
