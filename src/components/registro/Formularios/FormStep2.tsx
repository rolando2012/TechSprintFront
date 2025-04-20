'use client';
import { forwardRef } from 'react';

type Props = {
  onSubmitSuccess: () => void;
};

const FormStep2 = forwardRef<HTMLFormElement, Props>(({ onSubmitSuccess }, ref) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity()) onSubmitSuccess();
    else form.reportValidity();
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Paso 2</h2>
      <input
        type="email"
        name="email"
        required
        placeholder="Correo electrónico"
        className="w-full p-2 border rounded"
      />
    </form>
  );
});

export default FormStep2;
