import { useEffect, useState } from "react";
import Button from "../../components/UI/Button";
import Footer from "../../layouts/Footer";
import Header from "../../layouts/Header";
import type { Category } from "../../types";
import { getCategories } from "../../services/event";
import categoryImage from "../../assets/fireworks.jpg";
import Loading from "../../components/UI/Loading";
import Error from "../../components/UI/Error";
import toast from "react-hot-toast";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../services/eventAdmin";
import Modal from "../../components/UI/Modal";
import CategoryForm from "../../components/forms/CategoryForm";
import EditCategoryForm from "../../components/forms/EditCategoryForm";
import { Pencil, Trash2 } from "lucide-react";

const Categories = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCategory = async (formData: FormData) => {
    try {
      setLoading(true);
      await createCategory(formData);
      toast.success("Category created successfully!");
      setIsCreateModalOpen(false);
      // Refresh categories list
      const { data: updatedCategories } = await getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.message || "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (formData: FormData) => {
    if (!selectedCategory) return;

    try {
      setLoading(true);
      if (selectedCategory.id) {
        await updateCategory(selectedCategory.id, formData);
      } else {
        toast.error("Category ID is missing.");
      }
      toast.success("Category updated successfully!");
      setIsEditModalOpen(false);
      // Refresh categories list
      const { data: updatedCategories } = await getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.message || "Failed to update category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      setLoading(true);
      if (selectedCategory?.id) {
        await deleteCategory(selectedCategory.id);
      } else {
        toast.error("Category ID is missing.");
      }
      toast.success("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      // Refresh categories list
      const { data: updatedCategories } = await getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.message || "Failed to delete category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Categories</h1>
              <p className="text-gray-600">Manage your event categories</p>
            </div>

            <Button
              className="mt-4 md:mt-0"
              variant="default"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create New Category
            </Button>
          </div>

          {/* Featured categories */}
          <section className="py-12 ">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative overflow-hidden rounded-lg h-40 group shadow-md transition-transform hover:scale-[1.05] cursor-pointer duration-300"
                >
                  {category.image ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${category.image}`}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-fill"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={categoryImage}
                      alt="Placeholder"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xl md:text-2xl text-center px-2">
                      {category.name}
                    </span>
                  </div>

                  {/* Action buttons (shown on hover) */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(category);
                        setIsEditModalOpen(true);
                      }}
                      className="bg-primary-100 hover:bg-primary-300 rounded-full p-2 duration-300"
                    >
                      <Pencil className="h-4 w-4 text-primary-700" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(category);
                        setIsDeleteModalOpen(true);
                      }}
                      className="bg-red-100 hover:bg-red-300 rounded-full p-2 duration-300"
                    >
                      <Trash2 className="h-4 w-4 text-red-700" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={isCreateModalOpen}
        closeModal={() => setIsCreateModalOpen(false)}
        title="Create New Category"
      >
        <CategoryForm
          onSave={handleCreateCategory}
          onCancel={handleModalClose}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        title="Edit Category"
      >
        <EditCategoryForm
          category={selectedCategory!}
          onSave={handleEditCategory}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
      >
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="cancel" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCategory}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
