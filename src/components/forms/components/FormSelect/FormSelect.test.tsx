import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormSelect from './FormSelect';

function FormWrapper({ children }: { children: (methods: ReturnType<typeof useForm>) => React.ReactNode }) {
  const methods = useForm({
    defaultValues: { testField: '' }
  });
  return <>{children(methods)}</>;
}

describe('FormSelect', () => {
  it('renders label correctly', () => {
    render(
      <FormWrapper>
        {(methods) => (
          <FormSelect
            label="Test Label"
            name="testField"
            register={methods.register}
            errors={methods.formState.errors}
          >
            <option value="">Select...</option>
          </FormSelect>
        )}
      </FormWrapper>
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders select field', () => {
    render(
      <FormWrapper>
        {(methods) => (
          <FormSelect
            label="Test Label"
            name="testField"
            register={methods.register}
            errors={methods.formState.errors}
          >
            <option value="">Select...</option>
          </FormSelect>
        )}
      </FormWrapper>
    );
    
    const select = screen.getByLabelText('Test Label');
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe('SELECT');
  });

  it('renders options', () => {
    render(
      <FormWrapper>
        {(methods) => (
          <FormSelect
            label="Test Label"
            name="testField"
            register={methods.register}
            errors={methods.formState.errors}
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </FormSelect>
        )}
      </FormWrapper>
    );
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('handles error state structure', () => {
    render(
      <FormWrapper>
        {(methods) => (
          <FormSelect
            label="Test Label"
            name="testField"
            register={methods.register}
            errors={{ testField: { type: 'required', message: 'This field is required' } }}
          >
            <option value="">Select...</option>
          </FormSelect>
        )}
      </FormWrapper>
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    const select = screen.getByLabelText('Test Label');
    expect(select).toHaveClass('border-red-500');
  });
});

