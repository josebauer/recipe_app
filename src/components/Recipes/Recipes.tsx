import { useEffect, useState } from "react";
import Input from "../Input/Input";
import { Alert, Button, Pressable, ScrollView, Text, View } from "react-native";
import { Measure, useRecipeDatabase } from "@/database/useRecipeDatabase";
import { CategoryDatabase, useCategoryDatabase } from "@/database/useCategoryDatabase";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import TextArea from "../TextArea/TextArea";

type Ingredient = {
  name: string;
  quantity: number;
  measure: string;
}

export default function Recipes() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [measure, setMeasure] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [categories, setCategories] = useState<CategoryDatabase[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const recipeDatabase = useRecipeDatabase()
  const categoryDatabase = useCategoryDatabase()

  useEffect(() => {
    async function fetchData() {
      try {
        const measuresData = await recipeDatabase.getAllMeasures();
        const categoriesData = await categoryDatabase.getAllCategories();
        setMeasures(measuresData);
        setCategories(categoriesData);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as categorias ou medidas.");
      }
    }

    fetchData()
  }, [])

  async function create() {
    try {
      if (!name || !categoryId || ingredients.length === 0) {
        Alert.alert("Atenção", "Preencha todos os campos obrigatórios e adicione pelo menos um ingrediente.");
        return;
      }

      await recipeDatabase.create(
        {
          name,
          description,
          instructions,
          categoryId: Number(categoryId),
        },
        ingredients
      );

      Alert.alert("Sucesso", `Receita "${name}" cadastrada com sucesso!`)
      setName("")
      setDescription("")
      setInstructions("")
      setCategoryId("")
      setIngredients([])
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar a receita. Tente novamente.");
      console.error(error);
    }
  }

  function addIngredient() {
    if (ingredientName && quantity && measure) {
      if (isNaN(Number(quantity))) {
        Alert.alert("Atenção", "A quantidade deve ser um número.");
        return;
      }

      const newIngredient = { name: ingredientName, quantity: Number(quantity), measure };

      if (editingIndex !== null) {
        const updatedIngredients = [...ingredients]
        updatedIngredients[editingIndex] = newIngredient
        setIngredients(updatedIngredients)
        setEditingIndex(null)
      } else {
        setIngredients([...ingredients, newIngredient])
      }

      setIngredientName("");
      setQuantity("");
      setMeasure("");
    } else {
      Alert.alert("Atenção", "Preencha todos os campos do ingrediente.")
    }
  }

  function removeIngredient(index: number) {
    const updatedIngredients = ingredients.filter((_, i) => i !== index)
    setIngredients(updatedIngredients)
    setIngredientName("")
    setQuantity("")
    setMeasure("")
    setEditingIndex(null)
  }

  function editIngredient(index: number) {
    const ingredientToEdit = ingredients[index];
    setIngredientName(ingredientToEdit.name);
    setQuantity(String(ingredientToEdit.quantity));
    setMeasure(ingredientToEdit.measure);
    setEditingIndex(index);
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20, gap: 16 }}>
      <Input placeholder="Nome da receita" onChangeText={setName} value={name} />
      <Picker
        selectedValue={categoryId}
        onValueChange={(itemValue) => setCategoryId(itemValue)}
        style={{ backgroundColor: "#ad0000", color: "#FFF" }}
        dropdownIconColor="#FFF"
      >
        <Picker.Item label="Selecione uma categoria" value={null} />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>
      <TextArea 
        placeholder="Descrição da receita"
        onChangeText={setDescription}
        value={description}
      />
      <Text style={{ fontWeight: "bold" }}>Ingredientes:</Text>
      <Input placeholder="Nome do Ingrediente" onChangeText={setIngredientName} value={ingredientName} />
      <Input placeholder="Quantidade" onChangeText={setQuantity} value={quantity} keyboardType="numeric" />
      <Picker
        selectedValue={measure}
        onValueChange={(itemValue) => setMeasure(itemValue as string)}
        style={{ backgroundColor: "#ad0000", color: "#FFF" }}
        dropdownIconColor="#FFF"
      >
        <Picker.Item label="Unidade de medida" value="" />
        {measures.map((measure) => (
          <Picker.Item key={measure.id} label={measure.unit} value={measure.unit} />
        ))}
      </Picker>
      <Button title={editingIndex !== null ?  "Salvar Ingrediente" : "+ Adicionar Ingrediente" } onPress={addIngredient} />

      <View style={{gap: 10}}>
        {ingredients.length > 0 ? (
          ingredients.map((item, index) => (
            <Pressable
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#cedaf5",
                borderRadius: 10,
                padding: 24,
                gap: 10
              }}
            >
              <Text style={{ flex: 1 }}>{`${item.quantity} ${item.measure} de ${item.name}`}</Text>
              <TouchableOpacity onPress={() => removeIngredient(index)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editIngredient(index)}>
                <MaterialIcons name="edit" size={24} color="blue" />
              </TouchableOpacity>
            </Pressable>
          ))
        ) : (
          <Text style={{ textAlign: "center" }}>Nenhum ingrediente adicionado.</Text>
        )}
      </View>
      <TextArea 
        placeholder="Modo de preparo"
        onChangeText={setInstructions}
        value={instructions}
      />
      <Button title="+ Adicionar Receita" onPress={create} />
    </ScrollView>
  );
}