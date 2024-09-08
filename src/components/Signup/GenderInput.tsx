import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { gender } from "../../models/User";
export default function GenderInput({
  value,
  onChangeHandler,
}: {
  value: gender;
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="gender-label">Gender</InputLabel>
      <Select
        id="gender-select-id"
        label="Gender"
        value={value}
        onChange={
          onChangeHandler as unknown as (
            event: SelectChangeEvent<gender>
          ) => void
        }
        name="gender"
      >
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </Select>
    </FormControl>
  );
}
