import Select from "react-select";

const StudentMultiSelect = ({
  studentArray,
  state,
  handleViewUpdate,
  filter,
}) => {
  // Ensure filter is a string
  const filterString = typeof filter === "string" ? filter.toLowerCase() : "";

  // Filter students based on the input filter
  const filteredStudents = studentArray?.filter((student) =>
    `${student.first_name} ${student.last_name}`
      .toLowerCase()
      .includes(filterString)
  );

  // Map filtered students to the format required by react-select
  const studentOptions = filteredStudents.map((student) => ({
    value: student.user_id,
    label: `${student.first_name} ${student.last_name}`,
  }));

  // Handle change in selected students
  const handleSelectChange = (selectedOptions) => {
    handleViewUpdate({ ...state, selectedStudents: selectedOptions });
  };

  return (
    <Select
      isMulti
      value={state.SelectedStudents}
      openMenuOnFocus={false}
      openMenuOnClick={false}
      styles={{
        // Styles for the select component
        control: (provided) => ({
          ...provided,
          border: "1px solid rgb(var(--color-border-primary))",
          color: "rgb(var(--color-text-primary))",
          borderRadius: "0.375rem",
          width: "100%",
          minWidth: "15rem",
          minHeight: "2.5rem",
          backgroundColor: "rgb(var(--color-bg-secondary))",
        }),

        // Styles for the input field text color
        input: (provided) => ({
          ...provided,
          color: "rgb(var(--color-text-primary))",
        }),

        // Styles of the whole component of student when multiple values are selected
        multiValue: (provided) => ({
          ...provided,
          borderRight: "1px solid rgb(var(--color-border-primary))",
          borderRadius: "0.375rem",
          backgroundColor: "rgb(var(--color-bg-gray))",
        }),
        // label of the selected component
        multiValueLabel: (provided) => ({
          ...provided,
          borderRadius: "0.375rem 0 0 0.375rem",
          color: "rgb(var(--color-text-primary))",
        }),

        // x button to remove a selected value
        multiValueRemove: (provided) => ({
          ...provided,
          color: "rgb(var(--color-text-primary))",
          ":hover": {
            backgroundColor: "rgb(var(--color-bg-primary))",
            color: "rgb(var(--color-text-primary))",
          },
        }),

        // styles for the dropdown options
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected
            ? "rgb(var(--color-primary))"
            : state.isFocused
              ? "rgb(var(--color-hover-select))"
              : "rgb(var(--color-bg-secondary))",
          color: state.isDisabled
            ? "rgb(var(--color-text-secondary))"
            : "rgb(var(--color-text-primary))",
          ":active": {
            backgroundColor: "rgb(var(--color-bg-primary))",
            color: "rgb(var(--color-text-primary))",
          },
        }),

        // Styles for the dropdown menu when opened
        menu: (provided) => ({
          ...provided,
          backgroundColor: "rgb(var(--color-bg-secondary))",
          color: "rgb(var(--color-text-primary))",
        }),
      }}
      onChange={handleSelectChange}
      options={studentOptions}
      closeMenuOnSelect={false}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Hae oppilaita"
    />
  );
};

export default StudentMultiSelect;
