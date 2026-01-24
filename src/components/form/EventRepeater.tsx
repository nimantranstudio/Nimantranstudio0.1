import { Trash2, Plus } from 'lucide-react';
import { useWeddingStore } from '@/store/wedding-store';
import { Input } from './Input';
import styles from './Form.module.css';

export const EventRepeater = () => {
    const { formData, updateEvent, addEvent, removeEvent } = useWeddingStore();

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Events</h2>

            {formData.events.map((event, index) => (
                <div key={event.id} className={styles.repeaterItem}>
                    <div className={styles.itemHeader}>
                        <h3 className={styles.itemTitle}>Event #{index + 1}</h3>
                        {formData.events.length > 1 && (
                            <button
                                onClick={() => removeEvent(event.id)}
                                className={styles.removeBtn}
                                title="Remove Event"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    <div className={styles.grid}>
                        <Input
                            label="Event Name"
                            placeholder="e.g. Sangeet, Reception"
                            value={event.name}
                            onChange={(e) => updateEvent(event.id, { name: e.target.value })}
                        />
                        <Input
                            label="Welcome Message"
                            placeholder="e.g. Join us for an evening of music and dance"
                            value={event.description || ''}
                            onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                        />
                        <Input
                            label="Venue"
                            placeholder="e.g. Grand Hotel"
                            value={event.venue}
                            onChange={(e) => updateEvent(event.id, { venue: e.target.value })}
                        />
                        <Input
                            label="Date"
                            type="date"
                            value={event.date}
                            onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                        />
                        <Input
                            label="Time"
                            type="time"
                            value={event.time}
                            onChange={(e) => updateEvent(event.id, { time: e.target.value })}
                        />
                    </div>
                </div>
            ))}

            <button onClick={addEvent} className={`btn ${styles.addBtn}`}>
                <Plus size={18} className={styles.btnIcon} /> Add Another Event
            </button>
        </div>
    );
};
