import React, { useState } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const HoraPickerComponent = ({ hora, setHora }) => {
  const [open, setOpen] = useState(false);

  const initialHora = hora;

  const showPicker = () => setOpen(true);
  const hidePicker = () => setOpen(false);

  const onHoraChange = (event, selectedHora) => {
    const currentHora = selectedHora || initialHora;
    setOpen(false);
    setHora(currentHora);
  };

  const formattedHora = `${initialHora
    .getHours()
    .toString()
    .padStart(2, "0")}:${initialHora.getMinutes().toString().padStart(2, "0")}`;

  return (
    <View style={styles.container}>
      <Button title="Selecionar Hora" onPress={showPicker} />
      <Text style={styles.text}>{formattedHora}</Text>
      {open && (
        <DateTimePicker
          value={initialHora}
          mode="time"
          display="default"
          onChange={onHoraChange}
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
    fontSize: 18,
    marginTop: 10,
  },
});

export default HoraPickerComponent;
