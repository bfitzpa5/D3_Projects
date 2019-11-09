# -*- coding: utf-8 -*-
"""
Created on Sat Nov  9 13:30:28 2019

@author: Brendan Non-Admin
"""

import os
import pandas as pd

fname = os.path.join(
    os.path.expanduser('~'), 'Documents', 'GitHub', 'Metis_Projects', 
    '02-luther', 'data', 'box_office_mojo_pp_2019-01-13T01.02.14.csv'
)

df = pd.read_csv(fname)
imdb_genres = [
        'Action / Adventure', 'Action', 'Adventure', 'Animation', 'Biography',
        'Comedy', 'Comedy / Drama', 'Crime', 'Documentary', 'Drama', 'Family',
        'Fantasy', 'Film Noir', 'History', 'Horror', 'Music', 'Musical',
        'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Superhero', 'Thriller',
        'War', 'Western'
]
mask = df.genre.isin(imdb_genres)


(df.loc[mask, ]
 .assign(roi=lambda x: x.domestic_total_gross.div(x.budget) - 1)
 .groupby('genre', as_index=False)['roi'].median()
 .sort_values('roi', ascending=False)
 .to_csv(r'data/genre_roi.csv', index=False))
