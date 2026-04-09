import clsx from 'clsx';
import styles from './Form.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    error?: string;
    helperText?: string;
    type?: string;
    hideLabel?: boolean;
}

export const Input = ({ label, error, helperText, className, id, type, hideLabel, ...props }: InputProps) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={styles.field}>
            {!hideLabel && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}
            {type === 'textarea' ? (
                <textarea
                    id={inputId}
                    className={clsx(styles.input, styles.textarea, error && styles.inputError, className)}
                    rows={4}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    value={props.value ?? ''}
                />
            ) : (
                <input
                    id={inputId}
                    type={type}
                    className={clsx(styles.input, error && styles.inputError, className)}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                    value={props.value ?? ''}
                />
            )}
            {helperText && !error && <span className={styles.helper}>{helperText}</span>}
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};
