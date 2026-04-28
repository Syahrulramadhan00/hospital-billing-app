export default function InputError({ message, className = '' }) {
    return message ? (
        <p className={`${className} text-sm text-red-600`}>
            {message}
        </p>
    ) : null;
}
