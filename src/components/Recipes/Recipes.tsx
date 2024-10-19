import { useEffect, useState } from "react";
import Input from "../Input/Input";
import { Alert, Button, ScrollView, Text, View } from "react-native";
import { Measure, useRecipeDatabase } from "@/database/useRecipeDatabase";
import { CategoryDatabase, useCategoryDatabase } from "@/database/useCategoryDatabase";
import { Picker } from "@react-native-picker/picker";

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

    fetchData();
  }, []);

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

      Alert.alert("Sucesso", `Receita "${name}" cadastrada com sucesso!`);
      setName("");
      setDescription("");
      setInstructions("");
      setCategoryId("");
      setIngredients([]);
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

      setIngredients([
        ...ingredients,
        { name: ingredientName, quantity: Number(quantity), measure },
      ]);
      setIngredientName("");
      setQuantity("");
      setMeasure("");
    } else {
      Alert.alert("Atenção", "Preencha todos os campos do ingrediente.");
    }
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
      <Input placeholder="Descrição" onChangeText={setDescription} value={description} />

      <Text style={{ fontWeight: "bold", marginTop: 16 }}>Ingredientes:</Text>
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
      <Button title="+ Adicionar Ingrediente" onPress={addIngredient} />

      <View>
        {ingredients.length > 0 ? (
          ingredients.map((item, index) => (
            <Text
              key={index}
              style={{
                marginTop: 4,
                backgroundColor: "#c9c9c9",
                padding: 16
              }}
            >
              {`${item.quantity} ${item.measure} de ${item.name}`}</Text>
          ))
        ) : (
          <Text style={{ textAlign: "center" }}>Nenhum ingrediente adicionado.</Text>
        )}
      </View>

      <Input placeholder="Modo de preparo" onChangeText={setInstructions} value={instructions} />

      <Button title="+ Adicionar Receita" onPress={create} />
    </ScrollView>
  );
}