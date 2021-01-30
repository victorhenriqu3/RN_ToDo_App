import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import TaskList from "./src/components/TaskList";

const AnimateBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
  const [task, SetTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(" ");

//Busacando Tarefas ao iniciar o APP
  useEffect(()=>{
    async function loadTasks(){
      const taskStorage = await AsyncStorage.getItem('@task');
      if(taskStorage){
        SetTask(JSON.parse(taskStorage));
      }
    }
    loadTasks();
  },[]);

//Salvando tarefas alteradas
  useEffect(()=>{
    async function saveTasks(){
      await AsyncStorage.setItem('@task', JSON.stringify(task));
    }
    saveTasks();
  },[task]);

  function handleAdd(){
    if(input==='') return;

    const data = {
      key: input,
      task: input
    };

    SetTask([...task, data]);
    setOpen(false);
    setInput('');
  }

  const handleDelete = useCallback((data)=>{
    const find = task.filter(r => r.key !== data.key);
    SetTask(find);
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#171d31" barStyle="light-content" />

      <View styles={styles.content}>
        <Text style={styles.title}>Tarefas</Text>
      </View>
      {/* Aqui vai a lista de items */}
      <FlatList
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={(item) => String(item.key)}
        renderItem={({ item }) => <TaskList data={item} handleDelete={handleDelete} />}
      />

      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={ ()=> setOpen(false)}>
              <Ionicons style={{marginLeft: 5, marginRight: 5}} name="md-arrow-back" size={40} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}> Nova Tarefa </Text>
          </View>

          <Animatable.View 
          style={styles.modalBody}
          animation='fadeInUp'
          useNativeDriver
          >
            <TextInput
            multiline={true}
            placeholder="O que vamos fazer hoje?"
            style={styles.input}
            value={input}
            onChangeText={(text)=>setInput(text)}
            />
            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText}>Cadastrar</Text>
            </TouchableOpacity>
          </Animatable.View>

        </SafeAreaView>
      </Modal>

      <AnimateBtn 
      style={styles.fab}
      useNativeDriver
      animation="bounceInUp"
      duration={1500}
      onPress={ ()=> setOpen(true) }>
        <Ionicons name="ios-add" size={35} color="#FFF" />
      </AnimateBtn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171d31",
  },
  title: {
    color: "#FFF",
    fontSize: 25,
    textAlign: "center",
    paddingTop: 10,
    marginBottom: 10,
  },
  fab: {
    position: "absolute",
    alignItems: "center",
    width: 60,
    height: 60,
    backgroundColor: "#0094FF",
    justifyContent: "center",
    borderRadius: 30,
    bottom: 25,
    right: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 1,
      height: 3,
    },
  },
  modal:{
    flex: 1,
    backgroundColor: "#171d31",
  },
  modalHeader:{
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitle:{
    marginLeft: 15,
    fontSize: 25,
    color: "#fff",
  },
  modalBody:{
    marginTop: 15,
  },
  input:{
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 9,
    height: 85,
    textAlignVertical: 'top',
    color: "#000",
    borderRadius: 10,
  },
  handleAdd:{
    backgroundColor: "#0094FF",
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
  },
  handleAddText:{
    color: "#fff",
    fontSize: 15,
  }
});
