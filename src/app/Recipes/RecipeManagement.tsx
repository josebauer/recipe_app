import { useEffect, useState } from "react";
import { Alert, Button, Pressable, ScrollView, Text, View } from "react-native";
import { Measure, useRecipeDatabase } from "@/database/useRecipeDatabase";
import { CategoryDatabase, useCategoryDatabase } from "@/database/useCategoryDatabase";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import Input from "@/components/Input/Input";
import TextArea from "@/components/TextArea/TextArea";
import styles from "./RecipeManagementStyles";

export type Ingredient = {
  name: string;
  quantity: number;
  measure: string;
}

export default function RecipeManagement() {
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
  const router = useRouter();
  const { recipeId } = useLocalSearchParams()

  useEffect(() => {
    async function fetchData() {
      try {
        const measuresData = await recipeDatabase.getAllMeasures();
        const categoriesData = await categoryDatabase.getAllCategories();
        setMeasures(measuresData);
        setCategories(categoriesData);

        if (recipeId) {
          await loadRecipe(Number(recipeId));
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as categorias ou medidas.");
      }
    }

    fetchData()
  }, [recipeId])

  async function create() {
    try {
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

  async function update() {
    await recipeDatabase.update(
      {
        id: Number(id),
        name,
        description,
        instructions,
        categoryId: Number(categoryId),
      },
      ingredients
    );
    Alert.alert("Sucesso", `Receita "${name}" atualizada com sucesso!`);
  }

  async function loadRecipe(recipeId: number) {
    try {
      const recipeDetails = await recipeDatabase.getRecipeDetails(recipeId);
      setId(recipeDetails.id.toString());
      setName(recipeDetails.name);
      setDescription(recipeDetails.description);
      setInstructions(recipeDetails.instructions);
      setCategoryId(recipeDetails.categoryId.toString());
      setIngredients(recipeDetails.ingredients);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes da receita.");
    }
  }

  async function save() {
    try {
      if (!name || !categoryId || ingredients.length === 0) {
        Alert.alert("Atenção", "Preencha todos os campos obrigatórios e adicione pelo menos um ingrediente.");
        return;
      }

      if (id) {
        await update()
      } else {
        await create()
      }

      setName("");
      setDescription("");
      setInstructions("");
      setCategoryId("");
      setIngredients([]);
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a receita. Tente novamente.");
      console.error(error);
    }
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
      <Text style={styles.title}>{id? "Editar Receita" : "Adicionar Receita"}</Text>
      <Input placeholder="Nome da receita" onChangeText={setName} value={name} />
      <Picker
        selectedValue={categoryId}
        onValueChange={(itemValue) => setCategoryId(itemValue)}
        style={{ backgroundColor: "#ffa500", color: "#FFF" }}
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
        style={{ backgroundColor: "#ffa500", color: "#FFF" }}
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
                backgroundColor: "#ad0000",
                borderRadius: 10,
                padding: 24,
                gap: 10
              }}
            >
              <Text style={{ flex: 1, color: "#FFF" }}>{`${item.quantity} ${item.measure} de ${item.name}`}</Text>
              <TouchableOpacity onPress={() => removeIngredient(index)}>
                <MaterialIcons name="delete" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editIngredient(index)}>
                <MaterialIcons name="edit" size={24} color="#FFF" />
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
      <Button title={id ? "Salvar Alterações" : "+ Adicionar Receita"} onPress={save} />
    </ScrollView>
  );
}