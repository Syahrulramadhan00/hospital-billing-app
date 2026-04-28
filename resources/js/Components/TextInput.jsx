import { forwardRef } from 'react';

export default forwardRef(function TextInput({ className = '', ...props }, ref) {
    return (
        <input
            {...props}
            ref={ref}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
        />
    );
});
