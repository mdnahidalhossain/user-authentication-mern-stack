import React from 'react'
import { Check, X } from 'lucide-react';

function PasswordCriteria({ password }) {
    const criteria = [
        { label: "At least 6 characters", met: password.length >= 6 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },

    ];

    return (
        <div>
            {criteria.map((item) => (
                <div key={item.label} className='flex items-center text-xs mt-1'>
                    {item.met ? (<Check className='size-4'></Check>) : (<X className='size-4 mr-1' />)}
                    <span className={item.met ? "text-primary" : "text-grey-400"}>{item.label}</span>
                </div>
            ))}
        </div>
    )
}

const PasswordStrengthBar = ({password}) => {
    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
        if (pass.match(/\d/)) strength++;
        if (pass.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };
    const strength = getStrength(password)

    const getColor = (strength) => {
        if (strength === 0) return "bg-red-500";
        if (strength === 1) return "bg-red-400";
        if (strength === 2) return "bg-yellow-500";
        if (strength === 3) return "bg-primary";
        return "bg-green-500";
    };

    const getStrengthText = (strength) => {
        if (strength === 0) return "Very Weak";
        if (strength === 1) return "Weak";
        if (strength === 2) return "Fair";
        if (strength === 3) return "Good";
        return "Strong";
    };

    return (
        <>
            <div className='mt-2'>
                <div className='flex justify-between mb-1'>
                    <span>Passwrod Strength: {" "} {getStrengthText(strength)}</span>
                </div>
                <div className='flex space-x-1 justify-center mb-1.5'>
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${index < strength ? getColor(strength) : "bg-neutral-content"}`}>

                        </div>
                    ))}
                </div>
                <PasswordCriteria password={password} />
            </div>
        </>
    )
}

export default PasswordStrengthBar