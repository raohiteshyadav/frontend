import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Input, Button, FormLabel, Select, FormControl, Grid, GridItem, Spinner } from '@chakra-ui/react';
import axios from 'axios';

function App() {
  const [requestType, setRequestType] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [newItem, setNewItem] = useState('');

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (requestType) {
      setLoadingCategories(true);
      axios.get(`http://localhost:3000/category/${requestType}`)
        .then(response => {
          setCategories(response.data);
          setLoadingCategories(false);
          setSelectedCategory(''); // Reset category when request type changes
          setSubcategories([]); // Reset subcategories when request type changes
          setItems([]); // Reset items when request type changes
        })
        .catch(error => {
          console.error(error);
          setLoadingCategories(false);
        });
    } else {
      setCategories([]);
      setSelectedCategory('');
      setSubcategories([]);
      setItems([]);
    }
  }, [requestType]);

  useEffect(() => {
    if (selectedCategory) {
      setLoadingSubcategories(true);
      axios.get(`http://localhost:3000/subcategory/${selectedCategory}`)
        .then(response => {
          setSubcategories(response.data);
          setLoadingSubcategories(false);
          setSelectedSubcategory(''); // Reset subcategory when category changes
          setItems([]); // Reset items when category changes
        })
        .catch(error => {
          console.error(error);
          setLoadingSubcategories(false);
        });
    } else {
      setSubcategories([]);
      setItems([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubcategory) {
      setLoadingItems(true);
      axios.get(`http://localhost:3000/item/${selectedSubcategory}`)
        .then(response => {
          setItems(response.data);
          setLoadingItems(false);
        })
        .catch(error => {
          console.error(error);
          setLoadingItems(false);
        });
    } else {
      setItems([]);
    }
  }, [selectedSubcategory]);

  const handleRequestTypeChange = (e) => {
    setRequestType(e.target.value);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      axios.post('http://localhost:3000/category', { label: newCategory, type: requestType })
        .then(response => {
          setCategories([...categories, response.data]);
          setNewCategory('');
        })
        .catch(error => console.error(error));
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.trim() && selectedCategory) {
      axios.post('http://localhost:3000/subcategory', { name: newSubcategory, categoryId: selectedCategory })
        .then(response => {
          setSubcategories([...subcategories, response.data]);
          setNewSubcategory('');
        })
        .catch(error => console.error(error));
    }
  };

  const handleAddItem = () => {
    if (newItem.trim() && selectedSubcategory) {
      axios.post('http://localhost:3000/item', { name: newItem, subcategoryId: selectedSubcategory })
        .then(response => {
          setItems([...items, response.data]);
          setNewItem('');
        })
        .catch(error => console.error(error));
    }
  };

  return (
    <ChakraProvider>
      <Box p={5} boxShadow="md" borderRadius="md">
        <VStack spacing={4}>
          {/* Row 1 - Request Type, Add Category */}
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {/* Request Type Dropdown */}
            <GridItem>
              <FormControl>
                <FormLabel>Request Type</FormLabel>
                <Select value={requestType} onChange={handleRequestTypeChange} placeholder="Select Request Type">
                  <option value="service">Service</option>
                  <option value="incident">Incident</option>
                </Select>
              </FormControl>
            </GridItem>

            {/* Add Category Box */}
            <GridItem>
              <FormControl>
                <FormLabel>Add Category</FormLabel>
                <Input 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)} 
                  placeholder="Enter New Category" 
                  disabled={!requestType}
                />
              </FormControl>
            </GridItem>

            {/* Add Category Button */}
            <GridItem>
              <Button
                onClick={handleAddCategory}
                colorScheme="blue"
                mt={6}
                disabled={!requestType || !newCategory.trim()} // Disable until request type and category name are set
              >
                Add Category
              </Button>
            </GridItem>
          </Grid>

          {/* Row 2 - Category, Add Subcategory */}
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {/* Category Dropdown */}
            <GridItem>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  placeholder="Select Category"
                  disabled={!requestType || loadingCategories || !categories.length} // Disable until request type is selected
                >
                  {loadingCategories ? (
                    <option>Loading...</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))
                  )}
                </Select>
              </FormControl>
            </GridItem>

            {/* Add Subcategory Box */}
            <GridItem>
              <FormControl>
                <FormLabel>Add Subcategory</FormLabel>
                <Input 
                  value={newSubcategory} 
                  onChange={(e) => setNewSubcategory(e.target.value)} 
                  placeholder="Enter New Subcategory" 
                  disabled={!selectedCategory || loadingSubcategories}
                />
              </FormControl>
            </GridItem>

            {/* Add Subcategory Button */}
            <GridItem>
              <Button
                onClick={handleAddSubcategory}
                colorScheme="green"
                mt={6}
                disabled={!selectedCategory || !newSubcategory.trim() || loadingSubcategories} // Disable until category is selected
              >
                Add Subcategory
              </Button>
            </GridItem>
          </Grid>

          {/* Row 3 - Subcategory, Add Item */}
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {/* Subcategory Dropdown */}
            <GridItem>
              <FormControl>
                <FormLabel>Subcategory</FormLabel>
                <Select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    placeholder="Select Subcategory"
                    disabled={!selectedCategory || loadingSubcategories || !subcategories.length} // Disable until category is selected
                >
                  {loadingSubcategories ? (
                    <option>Loading...</option>
                  ) : (
                    subcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))
                  )}
                </Select>
              </FormControl>
            </GridItem>

            {/* Add Item Box */}
            <GridItem>
              <FormControl>
                <FormLabel>Add Item</FormLabel>
                <Input 
                  value={newItem} 
                  onChange={(e) => setNewItem(e.target.value)} 
                  placeholder="Enter New Item" 
                  disabled={!selectedSubcategory || !newItem.trim() || loadingItems} 
                />
              </FormControl>
            </GridItem>

            {/* Add Item Button */}
            <GridItem>
              <Button
                onClick={handleAddItem}
                colorScheme="teal"
                mt={6}
                disabled={!selectedSubcategory || !newItem.trim() || loadingItems} // Disable until subcategory is selected
              >
                Add Item
              </Button>
            </GridItem>
          </Grid>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
