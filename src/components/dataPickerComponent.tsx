import React, { useState } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DataPickerComponent = ({ data, setData }) => {
  const [open, setOpen] = useState(false);

  const initialData = data instanceof Date ? data : new Date();

  const showPicker = () => setOpen(true);
  const hidePicker = () => setOpen(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || initialData;
    setOpen(false);
    setData(formatDate(currentDate));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      <Button title="Selecionar Data" onPress={showPicker} />
      <Text style={styles.text}>{formatDate(initialData)}</Text>
      {open && (
        <DateTimePicker
          value={initialData}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default DataPickerComponent;
