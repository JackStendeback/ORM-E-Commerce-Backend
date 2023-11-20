const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'tagged_products'}]
    });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId, {
      include: [{ model: Product, through: ProductTag, as: 'tagged_products'}]
    });

    if (!tag) {
      res.status(404).json({ message: 'Tag with this id not found!' });
      return;
    }

    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json(error);
  }
});


router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const updatedTag = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: tagId,
        },
      }
    );
    if (updatedTag[0] === 0) {
      res.status(404).json({ message: 'Tag with this id not found!' });
      return;
    }
    res.json({ message: 'Tag updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const deletedTagCount = await Tag.destroy({
      where: { id: tagId }
    });
    if (deletedTagCount === 0) {
      res.status(404).json({ message: 'Tag with this id not found!' });
      return;
    }
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;
