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
import { createCategory } from "../../services/eventAdmin";
import Modal from "../../components/UI/Modal";
import CategoryForm from "../../components/forms/CategoryForm";

const Categories = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
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
      setIsModelOpen(false);
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

  const handleModalClose = () => {
    setIsModelOpen(false);
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
              onClick={() => setIsModelOpen(true)}
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
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={isModelOpen}
        closeModal={() => setIsModelOpen(false)}
        title="Create New Category"
      >
        <CategoryForm
          onSave={handleCreateCategory}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Categories;
