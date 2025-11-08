import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormInput from './FormInput';

// Wrapper component para usar con react-hook-form
function FormWrapper({ children }: { children: (methods: ReturnType<typeof useForm>) => React.ReactNode }) {
  const methods = useForm({
    defaultValues: { testField: '' }
  });
  return <>{children(methods)}</>;
}

describe('FormInput', () => {
  it('renders label correctly', () => {
    render(
      <FormWrapper>
        {(methods) => (
          <FormInput
            label="Test Label"
            name="testField"
            register={methods.register}
            errors={methods.formState.errors}
          />
        )}
      </FormWrapper>
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders input field', () => {
    render(
      <FormWrapper>
        {(methods) => (
          <FormInput
            label="Test Label"
            name="testField"
            register={methods.register}
            errors={methods.formState.errors}
          />
        )}
      </FormWrapper>
    );
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('displays prefix when provided', () => {
    render(
      <FormWrapper>
        {(methods) => (
          <FormInput
            label="Amount"
            name="testField"
            register={methods.register}
            errors={methods.formState.errors}
            prefix="$"
          />
        )}
      </FormWrapper>
    );
    
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('handles error state structure', () => {
    render(
      <FormWrapper>
        {(methods) => (
          <FormInput
            label="Test Label"
            name="testField"
            register={methods.register}
            errors={{ testField: { type: 'required', message: 'This field is required' } }}
          />
        )}
      </FormWrapper>
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-red-500');
  });

  it('accepts input props', () => {
    render(
      <FormWrapper>
        {(methods) => (
          <FormInput
            label="Test Label"
            name="testField"
            register={methods.register}
            errors={methods.formState.errors}
            type="number"
            placeholder="Enter number"
          />
        )}
      </FormWrapper>
    );
    
    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.placeholder).toBe('Enter number');
  });
});

