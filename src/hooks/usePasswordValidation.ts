import { useState } from 'react';

interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const usePasswordValidation = () => {
  const [validation, setValidation] = useState<PasswordValidation>({
    isValid: false,
    errors: [],
    strength: 'weak'
  });

  const validatePassword = (password: string): PasswordValidation => {
    const errors: string[] = [];
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    // Minimum length check
    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }

    // Check for number
    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }

    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial');
    }

    // Common passwords check
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      'dida', 'gestor', 'driblus'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Senha muito comum, escolha uma mais segura');
    }

    // Determine strength
    const criteria = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
      password.length >= 12,
      !commonPasswords.includes(password.toLowerCase())
    ];

    const score = criteria.filter(Boolean).length;
    
    if (score >= 6) {
      strength = 'strong';
    } else if (score >= 4) {
      strength = 'medium';
    }

    const result = {
      isValid: errors.length === 0,
      errors,
      strength
    };

    setValidation(result);
    return result;
  };

  const getStrengthColor = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'weak':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'strong':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStrengthText = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'weak':
        return 'Fraca';
      case 'medium':
        return 'Média';
      case 'strong':
        return 'Forte';
      default:
        return '';
    }
  };

  return {
    validation,
    validatePassword,
    getStrengthColor,
    getStrengthText
  };
};