import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const CampusMultiSelect = ({
  campusArray,
  selectedCampuses,
  setSelectedCampuses,
  filter,
}) => {
  // Ensure filter is a string
  const filterString = typeof filter === "string" ? filter.toLowerCase() : "";

  // Filter campuses based on the input filter
  const filteredCampuses = campusArray?.filter((campus) =>
    campus.name.toLowerCase().includes(filterString)
  );

  // Map filtered campuses to the format required by react-select
  const campusOptions = filteredCampuses.map((campus) => ({
    value: campus.id,
    label: campus.name,
  }));

  // Handle change in selected campuses
  const handleSelectChange = (selectedOptions) => {
    setSelectedCampuses(selectedOptions);
  };

  return (
    <Select
      isMulti
      components={makeAnimated()}
      value={selectedCampuses}
      styles={{
        // Styles for the select component
        control: (provided) => ({
          ...provided,
          border: "1px solid rgb(var(--color-border-primary))",
          color: "rgb(var(--color-text-primary))",
          borderRadius: "0.375rem",
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
              ? "rgb(var(--color-primary))"
              : "rgb(var(--color-bg-secondary))",
          color: "rgb(var(--color-text-primary))",
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
      placeholder="Select Campuses"
    />
  );
};

export default CampusMultiSelect;
