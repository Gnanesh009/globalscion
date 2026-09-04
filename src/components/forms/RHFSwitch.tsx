import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

interface RHFSwitchProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  helperText?: string;
  disabled?: boolean;
}

export function RHFSwitch<T extends FieldValues>({ name, label, helperText, disabled }: RHFSwitchProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Stack>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(field.value)}
                onChange={(event) => field.onChange(event.target.checked)}
                disabled={disabled}
              />
            }
            label={label}
            slotProps={{ typography: { fontSize: '0.9375rem', fontWeight: 500 } }}
          />
          {helperText && <FormHelperText sx={{ ml: 6, mt: -0.5 }}>{helperText}</FormHelperText>}
        </Stack>
      )}
    />
  );
}
