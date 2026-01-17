import clsx from 'clsx';
import styles from './Form.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export const Input = ({ label, error, helperText, className, id, ...props }: InputProps) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={styles.field}>
            <label htmlFor={inputId} className={styles.label}>
                {label}
            </label>
            <input
                id={inputId}
                className={clsx(styles.input, error && styles.inputError, className)}
                {...props}
            />
            {helperText && !error && <span className={styles.helper}>{helperText}</span>}
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};
