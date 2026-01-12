import { Schema, model, type Document, type Model } from 'mongoose';

// Shape of data required to create an Event.
export interface EventAttrs {
  title: string;
  slug?: string; // generated from title
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // stored as ISO-8601 string
  time: string; // stored as HH:mm (24h)
  mode: string;
  audience: string;
  agenda: string[];
}

// Full Event document stored in MongoDB.
export interface EventDocument extends EventAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface EventModel extends Model<EventDocument> {}

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        // Ensure agenda is a non-empty array of non-empty strings.
        validator(value: string[]): boolean {
          return (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every((item) => typeof item === 'string' && item.trim().length > 0)
          );
        },
        message: 'Agenda must be a non-empty array of non-empty strings',
      },
    },
  },
  {
    timestamps: true, // auto-manage createdAt/updatedAt
    versionKey: false,
  },
);

// Ensure database-level uniqueness for slug.
eventSchema.index({ slug: 1 }, { unique: true });

// Generate URL-friendly slug from event title.
function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) {
    throw new Error('Unable to generate slug from title; title must contain letters or numbers');
  }

  return slug;
}

// Normalize and validate date string to ISO-8601.
function normalizeDateToISO(dateInput: string): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date.toISOString();
}

// Normalize time to HH:mm (24h) format; accepts "HH:mm" or "h:mm AM/PM".
function normalizeTimeTo24h(timeInput: string): string {
  const trimmed = timeInput.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]))?$/);

  if (!match) {
    throw new Error('Invalid time format, expected HH:mm or h:mm AM/PM');
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (minutes < 0 || minutes > 59) {
    throw new Error('Invalid minutes in time value');
  }

  if (meridiem) {
    if (hours < 1 || hours > 12) {
      throw new Error('Invalid hour in 12-hour time value');
    }

    if (meridiem === 'PM' && hours !== 12) {
      hours += 12;
    }

    if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }
  } else if (hours < 0 || hours > 23) {
    throw new Error('Invalid hour in 24-hour time value');
  }

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');

  return `${hh}:${mm}`;
}

// Pre-save hook: generate slug, normalize date/time, and ensure required fields are non-empty.
eventSchema.pre<EventDocument>('save', function preSave(next) {
  try {
    if (!this.title || !this.title.trim()) throw new Error('Title is required');
    if (!this.description || !this.description.trim()) throw new Error('Description is required');
    if (!this.overview || !this.overview.trim()) throw new Error('Overview is required');
    if (!this.image || !this.image.trim()) throw new Error('Image is required');
    if (!this.venue || !this.venue.trim()) throw new Error('Venue is required');
    if (!this.location || !this.location.trim()) throw new Error('Location is required');
    if (!this.mode || !this.mode.trim()) throw new Error('Mode is required');
    if (!this.audience || !this.audience.trim()) throw new Error('Audience is required');
    if (!this.date || !this.date.trim()) throw new Error('Date is required');
    if (!this.time || !this.time.trim()) throw new Error('Time is required');

    // Only regenerate slug when title changes or slug is missing.
    if (this.isModified('title') || !this.slug) {
      this.slug = generateSlug(this.title);
    }

    // Normalize and validate date/time for consistent storage, but only when modified.
    if (this.isModified('date')) {
      this.date = normalizeDateToISO(this.date);
    }
    if (this.isModified('time')) {
      this.time = normalizeTimeTo24h(this.time);
    }

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Event = model<EventDocument, EventModel>('Event', eventSchema);
