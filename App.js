import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableOpacity, Image } from 'react-native';

export default function App() {
  const [userId, setUserId] = useState('');
  const [userTipo, setUserTipo] = useState('');
  const [userDado, setUserDado] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    fetch("http://192.168.0.49:5000/sensor_api")
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        setPosts(result.Sensor); // Acessando o campo "Sensor" da resposta
        Alert.alert('GET Sucesso', 'Sensores carregados com sucesso!');
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('GET Falha', 'Não foi possível carregar sensores.');
      });
  };

  const deleteUsers = (id) => {
    fetch(`http://192.168.0.49:5000/sensor_api/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        Alert.alert('DELETE Sucesso', 'Usuário deletado com sucesso!');
        getUsers(); // Atualiza a lista de sensores após a exclusão
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('DELETE Falha', 'Não foi possível deletar o usuário.');
      });
  };

  const updateUsers = (id, tipo, dados) => {
    fetch(`http://192.168.0.49:5000/sensor_api/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tipo: tipo, dados: dados })
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        Alert.alert('PUT Sucesso', 'Usuário atualizado com sucesso!');
        getUsers(); // Atualiza a lista de sensores após a atualização
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('PUT Falha', 'Não foi possível atualizar o usuário.');
      });
  };

  const postUsers = (tipo, dados) => {
    fetch("http://192.168.0.49:5000/sensor_api", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tipo: tipo, dados: dados })
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        Alert.alert('POST Sucesso', 'Usuário criado com sucesso!');
        getUsers(); // Atualiza a lista de sensores após a criação
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('POST Falha', 'Não foi possível criar o usuário.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Sensores</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Id"
          value={userId}
          onChangeText={setUserId}
        />
        <TextInput
          style={styles.input}
          placeholder="Tipo"
          value={userTipo}
          onChangeText={setUserTipo}
        />
        <TextInput
          style={styles.input}
          placeholder="Dado"
          value={userDado}
          onChangeText={setUserDado}
        />
        <Button title="Delete" onPress={() => deleteUsers(userId)} />
        <Button title="Update" onPress={() => updateUsers(userId, userTipo, userDado)} />
        <Button title="Get" onPress={getUsers} />
        <Button title="Post" onPress={() => postUsers(userTipo, userDado)} />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text>{item.id}. {item.tipo} - {item.dados}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => console.log(`Edit post ${item.id}`)}>
                <Image source={{ uri: 'https://img.icons8.com/ios-glyphs/30/000000/edit.png' }} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteUsers(item.id)}>
                <Image source={{ uri: 'https://img.icons8.com/ios-glyphs/30/000000/delete-forever.png' }} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  postContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
});
