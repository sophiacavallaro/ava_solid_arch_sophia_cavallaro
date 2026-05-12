const Pet = require('../models/Pet')
const getUserByToken = require('../helpers/get-user-by-token')
const getToken = require('../helpers/get-tokens')

module.exports = class PetController {
    static async create(req, res) {
        const { name, age, weight, color } = req.body
        const images = req.files
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' })
            return
        }
        if (!age) {
            res.status(422).json({ message: 'A idade é obrigatória!' })
            return
        }
        if (!weight) {
            res.status(422).json({ message: 'O peso é obrigatório' })
            return
        }
        if (!color) {
            res.status(422).json({ message: 'A cor é obrigatória' })
            return
        }
        if (!images || images.length === 0) {
            res.status(422).json({ message: 'A imagem é obrigatória' })
            return
        }
        const imageNames = images.map((image) => image.filename)

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            image: imageNames,
            available: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        })
        try {
            const newPet = await pet.save()
            res.status(201).json({
                message: 'Pet cadastrado com sucesso!',
                pet: newPet
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    static async getAll(req, res) {
        try {
            const pets = await Pet.find().sort('-createdAt')
            res.status(200).json({ pets })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAllUserPets(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)
        try {
            const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')
            res.status(200).json({ pets })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        try {
            const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')
            res.status(200).json({ pets })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAllUserPets(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        try {
            const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')
            res.status(200).json({ pets })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    static async getAllUserAdoptions(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        try {
            const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')
            res.status(200).json({ pets })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    static async getPetById(req, res) {
        const id = req.params.id
        try {
            const pet = await Pet.findById(id)
            if (!pet) {
                res.status(404).json({ message: 'Pet não encontrado!' })
                return
            }
            res.status(200).json({ pet })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    static async removePetById(req, res) {
        const id = req.params.id
        const token = getToken(req)
        const user = await getUserByToken(token)
        try {
            const pet = await Pet.findById(id)
            if (!pet) {
                res.status(404).json({ message: 'Pet não encontrado!' })
                return
            }
            if (pet.user._id.toString() !== user._id.toString()) {
                res.status(403).json({ message: 'Você não tem permissão para remover este pet!' })
                return
            }
            await Pet.findByIdAndDelete(id)
            res.status(200).json({ message: 'Pet removido com sucesso!' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
}
