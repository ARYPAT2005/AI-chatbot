import { FlashcardArray } from "react-quizlet-flashcard"
import { useState } from "react"
import { toast } from "sonner"
import { useAuthStore } from "../store/authStore"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, Plus, Save, Trash2, BookOpen, History } from "lucide-react"

const Flashcards = () => {
  const { user, isAuthenticated, createFlashcards, isLoading, saveFlashcards, getFlashcards, updatePastDecks } =
    useAuthStore()
  const [flashcards, setFlashcards] = useState([])
  const [pastDecks, setPastDecks] = useState([])

  const formik = useFormik({
    initialValues: {
      name: "",
      cards: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Deck name is required"),
      cards: Yup.string().required("Definition Names are required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (flashcards.length === 0) {
        toast.error("Please create some flashcards first before saving.")
        return
      }

      const deckToSave = {
        name: values.name,
        cards: flashcards,
      }

      const response = await saveFlashcards(deckToSave)

      if (response && response.flashcards) {
        setPastDecks(response.flashcards)
        toast.success(`Deck "${deckToSave.name}" saved successfully!`)
        console.log("Current decks:", response.flashcards)
        response.flashcards.forEach((flashcard) => {
          console.log(flashcard)
        })
      } else {
        toast.error("Failed to save the deck.")
        console.error("Error: Response from server did not contain flashcards array.", response)
      }

      resetForm()
      setFlashcards([])
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const flashcards = await createFlashcards(formik.values.cards)
    let cleaned = flashcards.trim()
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7)
    }
    const array = JSON.parse(cleaned)
    setFlashcards(array)
  }

  const getFlashcardDecks = async () => {
    const response = await getFlashcards()
    if (response && response.flashcards) {
      setPastDecks(response.flashcards)
      console.log("Fetched decks:", response.flashcards)
    } else {
      console.error("Failed to fetch decks or no decks found.")
      setPastDecks([])
    }
  }

  const changeDeck = (deck) => {
    console.log(deck)
    setFlashcards(deck)
  }

  const deleteDeck = (index) => {
    const newDecks = pastDecks.filter((_, i) => i !== index)
    updatePastDecks(newDecks)
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-4xl mx-auto space-y-8"> 
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                Flashcard Creator
              </h1>
              <p className="text-lg text-gray-600">Create and study your personalized flashcard decks</p>
            </div>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-800">Create New Deck</CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your terms below and we'll generate flashcards for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Deck Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Medical Terms, Spanish Vocabulary"
                      className="h-12 text-center border-2 focus:border-blue-500 transition-colors"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                    />
                    {formik.errors.name && <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cards" className="text-sm font-medium text-gray-700">
                      Terms to Study
                    </Label>
                    <Input
                      id="cards"
                      name="cards"
                      placeholder="Cholera, Malaria, Tuberculosis, etc."
                      className="h-12 text-center border-2 focus:border-blue-500 transition-colors"
                      onChange={formik.handleChange}
                      value={formik.values.cards}
                    />
                    {formik.errors.cards && <p className="text-sm text-red-500 mt-1">{formik.errors.cards}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
                    {!isLoading ? (
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 h-12 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create Flashcards
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled
                        className="bg-blue-600 text-white px-6 py-3 h-12 rounded-lg flex items-center gap-2"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Flashcards...
                      </Button>
                    )}

                    <div className="flex justify-start mb-4 relative z-[10000]">
                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          <MenuButton
                            onClick={getFlashcardDecks}
                            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                          >
                            Past Decks
                            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                          </MenuButton>
                        </div>

                        <MenuItems
                          transition
                          className="absolute left-0 z-[9999] mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                          <div className="py-1">
                            {pastDecks.length > 0 ? (
                              pastDecks.map((deck, index) => (
                                 <MenuItem key={index}>
                                  <div className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900">
                                    <button
                                    type="button"
                                     onClick={() => changeDeck(deck.cards)}
                                      className="flex-grow text-left"
                                    >
                                      {deck.name}
                                    </button>
                                    <button className="p-1 rounded-full hover:bg-gray-200"
                                    type="button"
                                     onClick={() => deleteDeck(index)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  </MenuItem>
                                ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-gray-500">No past decks found.</div>
                            )}
                          </div>
                        </MenuItems>
                      </Menu>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Flashcards Display */}
            {flashcards.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl text-gray-800">Study Your Cards</CardTitle>
                  <CardDescription>Click on the cards to flip them and study</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center w-full">
                    <FlashcardArray
                      cards={flashcards}
                      frontContentStyle={{
                        border: "2px solid #e5e7eb",
                        borderRadius: "1rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                      }}
                      backContentStyle={{
                        border: "2px solid #e5e7eb",
                        borderRadius: "1rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        color: "white",
                        fontWeight: "500",
                        fontSize: "1rem",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-center">
                    <Button
                      onClick={() => formik.handleSubmit()}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 h-12 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Flashcard Deck
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
              <p className="text-gray-600">Please log in to access your flashcards</p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default Flashcards
