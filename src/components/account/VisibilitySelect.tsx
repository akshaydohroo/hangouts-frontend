import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
export default function VisibitySelect({
  enabled,
  value,
  onChangeHandler,
}: {
  enabled: Boolean
  value: String | undefined
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>
}) {
  return (
    <FormControl variant="outlined" fullWidth disabled={!enabled}>
      <InputLabel id="visibility-select-label">Visibility</InputLabel>
      <Select
        labelId="visibility-select-label"
        id="visibility-select"
        value={value}
        onChange={e =>
          onChangeHandler(e as React.ChangeEvent<HTMLInputElement>)
        }
        label="Visibility"
        name="visibility"
      >
        <MenuItem value="public">Public</MenuItem>
        <MenuItem value="private">Private</MenuItem>
      </Select>
    </FormControl>
  )
}
