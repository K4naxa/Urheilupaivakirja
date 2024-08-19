import Select from "react-select";

const CampusMultiSelect = ({
  campusArray,
  selectedCampuses,
  setSelectedCampuses,
  availableCampuses,
}) => {
  if (!campusArray) {
    return null;
  }

  // Map filtered campuses to the format required by react-select
  const campusOptions = campusArray?.map((campus) => {
    const availableCampus = availableCampuses?.find(
      (available) => available.name === campus.name
    );
    return {
      value: campus.id,
      label: `${campus.name}`,
      studentCount: availableCampus ? availableCampus.studentCount : 0,
      isDisabled: !availableCampus,
    };
  });

  // Handle change in selected campuses
  const handleSelectChange = (selectedOptions) => {
    setSelectedCampuses(selectedOptions);
  };

  const CustomOption = ({ label, studentCount }) => (
    <div className="flex justify-between">
      <div>{label}</div>
      {studentCount ? (
        <div className="flex text-xs bg-bgGray aspect-square w-4 justify-center items-center  rounded-full">
          {studentCount}
        </div>
      ) : null}
    </div>
  );

  return (
    <Select
      isMulti
      formatOptionLabel={CustomOption}
      value={selectedCampuses}
      openMenuOnFocus={false}
      openMenuOnClick={false}
      styles={{
        // Styles for the select component
        control: (provided) => ({
          ...provided,
          border: "1px solid rgb(var(--color-border-primary))",
          color: "rgb(var(--color-text-primary))",
          borderRadius: "0.375rem",
          minWidth: "15rem",
          width: "100%",
          minHeight: "2.5rem",
          backgroundColor: "rgb(var(--color-bg-secondary))",
        }),

        // Styles for the input field text color
        input: (provided) => ({
          ...provided,
          color: "rgb(var(--color-text-primary))",
        }),

        // Styles of the whole component of campus when multiple values are selected
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
      options={campusOptions}
      closeMenuOnSelect={false}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Valitse toimipaikat"
    />
  );
};

export default CampusMultiSelect;
