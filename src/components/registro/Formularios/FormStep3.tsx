'use client';
import { forwardRef } from 'react';

type Props = {
  onSubmitSuccess: () => void;
};

const FormStep3 = forwardRef<HTMLFormElement, Props>(({ onSubmitSuccess }, ref) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity()) onSubmitSuccess();
    else form.reportValidity();
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Paso 3</h2>
      <input
        type="text"
        name="campo3"
        required
        placeholder="Otro campo"
        className="w-full p-2 border rounded"
      />
    </form>
  );
});

export default FormStep3;
